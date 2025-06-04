from collections import Counter
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.external_clients.music_client import get_all_track_ids
from app.models.media_stats import MediaStats
from app.models.recommendation_model import Recommendation
from app.services.enrichment_service import EnrichmentService
from app.services.common_user_data import get_liked_entities, get_history_by_user

class RecommendationService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def recommend_for_user(self, user_id: UUID, entity_type: str = "track") -> list[dict]:
        liked_entities = get_liked_entities(self.db, user_id, entity_type)
        history_entities = get_history_by_user(self.db, user_id, entity_type)

        entity_ids = set(
            e["media"]["id"]
            for e in liked_entities + history_entities
            if e.get("media") and e["media"].get("id")
        )

        entities_meta = [e["media"] for e in liked_entities + history_entities if e.get("media")]

        all_ids = get_all_track_ids()
        all_entities = list(EnrichmentService.enrich_media(entity_type, all_ids).values())

        preferred_genres = Counter()
        preferred_artists = Counter()

        for meta in entities_meta:
            preferred_genres.update(meta.get("genres", []))
            if entity_type == "track":
                preferred_artists.update([meta.get("artist_id")])

        recommended = []
        for entity in all_entities:
            if entity["id"] in entity_ids:
                continue
            if any(genre in preferred_genres for genre in entity.get("genres", [])) or \
                    (entity_type == "track" and entity.get("artist_id") in preferred_artists):
                recommended.append({
                    "id": entity["id"],
                    "media": entity
                })

        self.save_recommendations(user_id, recommended, entity_type)
        return recommended[:10]

    def save_recommendations(self, user_id: UUID, entities: list[dict], entity_type: str):
        try:
            for entity in entities:
                recommendation = Recommendation(
                    user_id=user_id,
                    media_id=entity["media"]["id"],
                    media_type=entity_type,
                    recommended_at=datetime.utcnow()
                )
                self.db.add(recommendation)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_most_popular(self, entity_type: str = "track", limit: int = 10) -> list[dict]:
        stats = (
            self.db.query(MediaStats)
            .filter_by(media_type=entity_type)
            .order_by(MediaStats.play_count.desc())
            .limit(limit)
            .all()
        )
        ids = [stat.media_id for stat in stats]
        media_map = EnrichmentService.enrich_media(entity_type, ids)
        return [
            {
                "id": None,
                "user_id": None,
                "media_id": mid,
                "media_type": entity_type,
                "recommended_at": None,
                "media": media_map.get(str(mid)),
                "user": None,
            }
            for mid in ids if media_map.get(str(mid))
        ]