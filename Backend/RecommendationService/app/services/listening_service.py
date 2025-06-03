from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.media_stats import MediaStats
from app.models.history_model import ListeningHistory
from app.models.like_model import Like

from app.services.enrichment_service import EnrichmentService

class ListeningService:
    """
    Сервис для работы с историей прослушиваний и лайками любых медиа
    """

    def __init__(self, db_session: Session, media_type: str):
        self.db = db_session
        self.media_type = media_type

    def _validate_media_exists(self, media_id: UUID):
        media = EnrichmentService.enrich_media(self.media_type, [media_id]).get(str(media_id))
        if not media:
            raise ValueError(f"{self.media_type} with id {media_id} does not exist")

    def _get_or_create_stats(self, media_id: UUID) -> MediaStats:
        stats = (
            self.db.query(MediaStats)
            .filter_by(media_id=media_id, media_type=self.media_type)
            .first()
        )
        if stats is None:
            stats = MediaStats(
                media_id=media_id,
                media_type=self.media_type,
                play_count=0,
                like_count=0,
            )
            self.db.add(stats)
            self.db.flush()
        return stats

    def add_history(self, user_id: UUID, media_id: UUID) -> dict:
        """
        Добавляет запись о прослушивании и обновляет статистику
        """
        self._validate_media_exists(media_id)
        try:
            history = ListeningHistory(
                user_id=user_id,
                media_id=media_id,
                media_type=self.media_type,
                timestamp=datetime.utcnow(),
            )
            self.db.add(history)

            stats = self._get_or_create_stats(media_id)
            stats.play_count += 1

            self.db.commit()
            self.db.refresh(history)

            media_map = EnrichmentService.enrich_media(self.media_type, [media_id])
            return {
                "id": str(history.id),
                "user_id": str(history.user_id),
                "media_id": str(history.media_id),
                "media_type": history.media_type,
                "timestamp": history.timestamp,
                "media": media_map.get(str(media_id)),
            }
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def like_media(self, user_id: UUID, media_id: UUID) -> dict:
        """
        Ставит лайк на медиа и обновляет статистику
        """
        self._validate_media_exists(media_id)
        try:
            like = (
                self.db.query(Like)
                .filter_by(user_id=user_id, media_id=media_id, media_type=self.media_type)
                .first()
            )
            is_new_like = False
            if like:
                if not like.liked:
                    like.liked = True
                    like.timestamp = datetime.utcnow()
                    is_new_like = True
            else:
                like = Like(
                    user_id=user_id,
                    media_id=media_id,
                    media_type=self.media_type,
                    liked=True,
                    timestamp=datetime.utcnow(),
                )
                self.db.add(like)
                is_new_like = True

            if is_new_like:
                stats = self._get_or_create_stats(media_id)
                stats.like_count += 1

            self.db.commit()
            self.db.refresh(like)

            media_map = EnrichmentService.enrich_media(self.media_type, [media_id])
            return {
                "id": str(like.id),
                "user_id": str(like.user_id),
                "media_id": str(like.media_id),
                "media_type": like.media_type,
                "liked": like.liked,
                "timestamp": like.timestamp,
                "media": media_map.get(str(media_id)),
            }
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e

    def unlike_media(self, user_id: UUID, media_id: UUID) -> dict | None:
        """
        Убирает лайк с медиа и обновляет статистику
        """
        self._validate_media_exists(media_id)
        try:
            like = (
                self.db.query(Like)
                .filter_by(user_id=user_id, media_id=media_id, media_type=self.media_type)
                .first()
            )
            if like and like.liked:
                like.liked = False
                like.timestamp = datetime.utcnow()

                stats = self._get_or_create_stats(media_id)
                if stats.like_count > 0:
                    stats.like_count -= 1

                self.db.commit()
                self.db.refresh(like)

                media_map = EnrichmentService.enrich_media(self.media_type, [media_id])
                return {
                    "id": str(like.id),
                    "user_id": str(like.user_id),
                    "media_id": str(like.media_id),
                    "media_type": like.media_type,
                    "liked": like.liked,
                    "timestamp": like.timestamp,
                    "media": media_map.get(str(media_id)),
                }
            return None
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e