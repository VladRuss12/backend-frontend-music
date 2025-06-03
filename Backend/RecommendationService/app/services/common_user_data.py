from uuid import UUID
from sqlalchemy.orm import Session
from app.models.like_model import Like
from app.models.history_model import ListeningHistory
from app.services.enrichment_service import EnrichmentService

def get_liked_entities(db: Session, user_id: UUID, entity_type: str = "track") -> list[dict]:
    """
    Получить все лайкнутые сущности
    """
    likes = (
        db.query(Like)
        .filter_by(user_id=user_id, media_type=entity_type, liked=True)
        .order_by(Like.timestamp.desc())
        .all()
    )
    media_ids = [like.media_id for like in likes]
    media_map = EnrichmentService.enrich_media(entity_type, media_ids)

    enriched = []
    for like in likes:
        enriched.append({
            "id": str(like.id),
            "user_id": str(like.user_id),
            "media_id": str(like.media_id),
            "media_type": like.media_type,
            "liked": like.liked,
            "timestamp": like.timestamp,
            "media": media_map.get(str(like.media_id)),
        })
    return enriched

def get_history_by_user(db: Session, user_id: UUID, entity_type: str = "track") -> list[dict]:
    """
    Получить историю прослушиваний пользователя
    """
    history = (
        db.query(ListeningHistory)
        .filter_by(user_id=user_id, media_type=entity_type)
        .order_by(ListeningHistory.timestamp.desc())
        .all()
    )
    media_ids = [record.media_id for record in history]
    media_map = EnrichmentService.enrich_media(entity_type, media_ids)

    enriched = []
    for record in history:
        enriched.append({
            "id": str(record.id),
            "user_id": str(record.user_id),
            "media_id": str(record.media_id),
            "media_type": record.media_type,
            "timestamp": record.timestamp,
            "media": media_map.get(str(record.media_id)),
        })
    return enriched