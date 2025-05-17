from uuid import UUID
from sqlalchemy.orm import Session
from app.external_clients.music_client import get_track_by_id, get_playlist_by_id
from app.models.history_model import Like, ListeningHistory

def get_liked_entities(db: Session, user_id: UUID, entity_type: str = "track") -> list[dict]:
    if entity_type == "track":
        likes = (
            db.query(Like)
            .filter_by(user_id=user_id, liked=True)
            .order_by(Like.timestamp.desc())
            .all()
        )
        enriched = []
        for like in likes:
            entity_data = get_track_by_id(like.track_id)
            enriched.append({
                "track": entity_data,
                "liked_at": like.timestamp.isoformat()
            })
        return enriched

    elif entity_type == "playlist":
        likes = (
            db.query(Like)
            .filter_by(user_id=user_id, liked=True)
            .order_by(Like.timestamp.desc())
            .all()
        )
        enriched = []
        for like in likes:
            entity_data = get_playlist_by_id(like.playlist_id)
            enriched.append({
                "playlist": entity_data,
                "liked_at": like.timestamp.isoformat()
            })
        return enriched

    else:
        raise ValueError("Unsupported entity_type")


def get_history_by_user(db: Session, user_id: UUID, entity_type: str = "track") -> list[dict]:
    if entity_type == "track":
        history = (
            db.query(ListeningHistory)
            .filter_by(user_id=user_id)
            .order_by(ListeningHistory.timestamp.desc())
            .all()
        )
        enriched = []
        for record in history:
            entity_data = get_track_by_id(record.track_id)
            enriched.append({
                "track": entity_data,
                "timestamp": record.timestamp.isoformat()
            })
        return enriched

    elif entity_type == "playlist":
        history = (
            db.query(ListeningHistory)
            .filter_by(user_id=user_id)
            .order_by(ListeningHistory.timestamp.desc())
            .all()
        )
        enriched = []
        for record in history:
            entity_data = get_playlist_by_id(record.playlist_id)
            enriched.append({
                "playlist": entity_data,
                "timestamp": record.timestamp.isoformat()
            })
        return enriched

    else:
        raise ValueError("Unsupported entity_type")
