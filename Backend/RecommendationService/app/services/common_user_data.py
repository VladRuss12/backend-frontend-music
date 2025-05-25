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
        return [
            {
                "id": str(like.id),  # id лайка
                "entity_id": str(like.track_id),  # id трека
                "entity_type": "track",
                "track": get_track_by_id(like.track_id),
                "liked_at": like.timestamp
            }
            for like in likes
        ]
    elif entity_type == "playlist":
        likes = (
            db.query(Like)
            .filter_by(user_id=user_id, liked=True)
            .order_by(Like.timestamp.desc())
            .all()
        )
        return [
            {
                "id": str(like.id),
                "entity_id": str(like.playlist_id),
                "entity_type": "playlist",
                "playlist": get_playlist_by_id(like.playlist_id),
                "liked_at": like.timestamp
            }
            for like in likes
        ]
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
        return [
            {
                "id": record.id,
                "track_id": record.track_id,
                "timestamp": record.timestamp,
                "track": get_track_by_id(record.track_id)
            }
            for record in history
        ]
    elif entity_type == "playlist":
        history = (
            db.query(ListeningHistory)
            .filter_by(user_id=user_id)
            .order_by(ListeningHistory.timestamp.desc())
            .all()
        )
        return [
            {
                "id": record.id,
                "playlist_id": record.playlist_id,
                "timestamp": record.timestamp,
                "playlist": get_playlist_by_id(record.playlist_id)
            }
            for record in history
        ]
    else:
        raise ValueError("Unsupported entity_type")