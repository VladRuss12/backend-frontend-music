from collections import Counter
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.external_clients.music_client import get_track_by_id, get_all_tracks
from app.models.recommendation_model import Recommendation


class RecommendationService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def recommend_for_user(self, user_id: UUID) -> list[dict]:
        # Получаем историю и лайки пользователя
        liked_tracks = self.get_liked_tracks(user_id)
        history_tracks = self.get_history_by_user(user_id)

        # Собираем все уникальные ID треков
        track_ids = set([t["track"]["id"] for t in liked_tracks + history_tracks])
        tracks_meta = [get_track_by_id(track_id) for track_id in track_ids]

        # Получаем предпочтения пользователя (по жанрам и артистам)
        preferred_genres = Counter()
        preferred_artists = Counter()
        for meta in tracks_meta:
            preferred_genres.update(meta.get("genres", []))
            preferred_artists.update(meta.get("artist_id", []))

        # Запрашиваем все треки и фильтруем по предпочтениям
        all_tracks = get_all_tracks()
        recommended = []

        for track in all_tracks:
            if track["id"] in track_ids:
                continue
            if any(genre in preferred_genres for genre in track.get("genres", [])) or \
               track.get("artist_id") in preferred_artists:
                recommended.append(track)

        # Сохраняем рекомендации в БД
        self.save_recommendations(user_id, recommended)

        return recommended[:10]  # Возвращаем топ 10 рекомендаций

    def save_recommendations(self, user_id: UUID, tracks: list[dict]):
        try:
            for track in tracks:
                recommendation = Recommendation(
                    user_id=user_id,
                    track_id=track["id"],
                    recommended_at=datetime.utcnow()
                )
                self.db.add(recommendation)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e
