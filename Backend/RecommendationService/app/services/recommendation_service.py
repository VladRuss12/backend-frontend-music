from collections import Counter
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.external_clients.music_client import get_track_by_id, get_all_tracks, get_playlist_by_id, get_all_playlists
from app.models.playlist_stats import PlaylistStats
from app.models.recommendation_model import Recommendation
from app.models.track_stats import TrackStats


class RecommendationService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def recommend_for_user(self, user_id: UUID, entity_type: str = "track") -> list[dict]:
        liked_entities = self.get_liked_entities(user_id, entity_type)
        history_entities = self.get_history_by_user(user_id, entity_type)


        entity_ids = set([e["id"] for e in liked_entities + history_entities])


        if entity_type == "track":
            entities_meta = [get_track_by_id(eid) for eid in entity_ids]
        elif entity_type == "playlist":
            entities_meta = [get_playlist_by_id(eid) for eid in entity_ids]
        else:
            raise ValueError("Unsupported entity_type")


        preferred_genres = Counter()
        preferred_artists = Counter()

        for meta in entities_meta:
            preferred_genres.update(meta.get("genres", []))
            if entity_type == "track":
                preferred_artists.update([meta.get("artist_id")])


        if entity_type == "track":
            all_entities = get_all_tracks()
        else:
            all_entities = get_all_playlists()

        recommended = []
        for entity in all_entities:
            if entity["id"] in entity_ids:
                continue
            if any(genre in preferred_genres for genre in entity.get("genres", [])) or \
               (entity_type == "track" and entity.get("artist_id") in preferred_artists):
                recommended.append(entity)


        self.save_recommendations(user_id, recommended, entity_type)

        return recommended[:10]

    def save_recommendations(self, user_id: UUID, entities: list[dict], entity_type: str):
        try:
            for entity in entities:
                recommendation = Recommendation(
                    user_id=user_id,
                    track_id=entity["id"] if entity_type == "track" else None,
                    playlist_id=entity["id"] if entity_type == "playlist" else None,
                    recommended_at=datetime.utcnow()
                )
                self.db.add(recommendation)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def get_most_popular(self, entity_type: str = "track", limit: int = 10) -> list[dict]:
            if entity_type == "track":
                # Получаем статистику по трекам, сортируем по количеству прослушиваний или лайков
                stats = (
                    self.db.query(TrackStats)
                    .order_by(TrackStats.play_count.desc())  # или TrackStats.like_count.desc()
                    .limit(limit)
                    .all()
                )
                # Берём ID треков
                ids = [stat.track_id for stat in stats]
                # Запрашиваем полные данные треков через внешний клиент
                popular_entities = [get_track_by_id(tid) for tid in ids]
                return popular_entities

            elif entity_type == "playlist":
                stats = (
                    self.db.query(PlaylistStats)
                    .order_by(PlaylistStats.view_count.desc())
                    .limit(limit)
                    .all()
                )
                ids = [stat.playlist_id for stat in stats]
                popular_entities = [get_playlist_by_id(pid) for pid in ids]
                return popular_entities

            else:
                raise ValueError("Unsupported entity_type")