from datetime import datetime
from sqlalchemy import desc
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.external_clients.music_client import get_track_by_id
from app.external_clients.user_client import get_user_by_id
from app.models.history_model import ListeningHistory, Like




class ListeningService:
    def __init__(self, db_session: Session):
        self.db = db_session

    # ---- История прослушиваний ----

    def add_history(self, user_id: UUID, track_id: UUID) -> ListeningHistory:
        get_user_by_id(user_id)
        get_track_by_id(track_id)

        try:
            history = ListeningHistory(
                user_id=user_id,
                track_id=track_id,
                timestamp=datetime.utcnow()
            )
            self.db.add(history)
            self.db.commit()
            self.db.refresh(history)
            return history
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e


    # ---- Лайки ----

    def like_track(self, user_id: UUID, track_id: UUID) -> Like:
        get_user_by_id(user_id)
        get_track_by_id(track_id)

        try:
            existing = self.db.query(Like).filter_by(user_id=user_id, track_id=track_id).first()
            if existing:
                existing.liked = True
                existing.timestamp = datetime.utcnow()
            else:
                existing = Like(user_id=user_id, track_id=track_id, liked=True)
                self.db.add(existing)
            self.db.commit()
            return existing
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def unlike_track(self, user_id: UUID, track_id: UUID) -> Like | None:
        get_user_by_id(user_id)
        get_track_by_id(track_id)

        try:
            like = self.db.query(Like).filter_by(user_id=user_id, track_id=track_id).first()
            if like:
                like.liked = False
                like.timestamp = datetime.utcnow()
                self.db.commit()
            return like
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

