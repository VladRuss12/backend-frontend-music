from uuid import UUID
from sqlalchemy.orm import Session
from app.external_clients.music_client import get_track_by_id
from app.models.history_model import Like, ListeningHistory

def get_liked_tracks(db: Session, user_id: UUID) -> list[dict]:
    likes = (
        db.query(Like)
        .filter_by(user_id=user_id, liked=True)
        .order_by(Like.timestamp.desc())
        .all()
    )
    enriched = []
    for like in likes:
        track_data = get_track_by_id(like.track_id)
        enriched.append({
            "track": track_data,
            "liked_at": like.timestamp.isoformat()
        })
    return enriched

def get_history_by_user(db: Session, user_id: UUID) -> list[dict]:
    history = (
        db.query(ListeningHistory)
        .filter_by(user_id=user_id)
        .order_by(ListeningHistory.timestamp.desc())
        .all()
    )
    enriched = []
    for record in history:
        track_data = get_track_by_id(record.track_id)
        enriched.append({
            "track": track_data,
            "timestamp": record.timestamp.isoformat()
        })
    return enriched
