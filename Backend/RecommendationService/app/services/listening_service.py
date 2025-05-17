from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.track_stats import TrackStats
from app.models.playlist_stats import PlaylistStats
from app.models.history_model import ListeningHistory, Like
from app.external_clients.music_client import get_track_by_id
from app.external_clients.music_client import get_playlist_by_id
class ListeningService:
    def __init__(self, db_session: Session, media_type: str):
        """
        :param db_session: активная сессия базы данных
        :param media_type: тип медиа (track или playlist)
        """
        self.db = db_session
        self.media_type = media_type
        self.model_stats = TrackStats if media_type == "track" else PlaylistStats
        self.model_history = ListeningHistory if media_type == "track" else None
        self.model_like = Like if media_type == "track" else None

    def add_history(self, user_id: UUID, media_id: UUID) -> ListeningHistory:
        """Добавление истории для прослушивания"""
        if self.media_type == "track":
            get_track_by_id(media_id)
        else:
            get_playlist_by_id(media_id)

        try:
            history = self.model_history(
                user_id=user_id,
                track_id=media_id,
                timestamp=datetime.utcnow()
            )
            self.db.add(history)

            stats = self.db.query(self.model_stats).filter_by(track_id=media_id).first()
            if stats:
                stats.play_count += 1
            else:
                stats = self.model_stats(track_id=media_id, play_count=1)
                self.db.add(stats)

            self.db.commit()
            self.db.refresh(history)
            return history
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def like_media(self, user_id: UUID, media_id: UUID) -> Like:
        """Лайк для медиа (трека или плейлиста)"""
        if self.media_type == "track":
            get_track_by_id(media_id)
        else:
            get_playlist_by_id(media_id)

        try:
            existing = self.db.query(self.model_like).filter_by(user_id=user_id, track_id=media_id).first()
            if existing:
                existing.liked = True
                existing.timestamp = datetime.utcnow()
            else:
                existing = self.model_like(user_id=user_id, track_id=media_id, liked=True)
                self.db.add(existing)

            # Обновление статистики
            stats = self.db.query(self.model_stats).filter_by(track_id=media_id).first()
            if stats:
                stats.like_count += 1
            else:
                stats = self.model_stats(track_id=media_id, like_count=1)
                self.db.add(stats)

            self.db.commit()
            return existing
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def unlike_media(self, user_id: UUID, media_id: UUID) -> Like | None:
        """Удаление лайка для медиа"""
        if self.media_type == "track":
            get_track_by_id(media_id)
        else:
            get_playlist_by_id(media_id)

        try:
            like = self.db.query(self.model_like).filter_by(user_id=user_id, track_id=media_id).first()
            if like and like.liked:
                like.liked = False
                like.timestamp = datetime.utcnow()

                stats = self.db.query(self.model_stats).filter_by(track_id=media_id).first()
                if stats and stats.like_count > 0:
                    stats.like_count -= 1

                self.db.commit()
            return like
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
