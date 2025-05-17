import uuid
import random
from app.models.track_stats import TrackStats
from app.models.playlist_stats import PlaylistStats
from app.seeders.utils import get_track_id, get_playlist_id

def generate_stats_seed(session, track_count: int = 10, playlist_count: int = 5):
    # Генерация статистики по трекам
    added_track_ids = set()
    while len(added_track_ids) < track_count:
        track_id = get_track_id()
        # Проверяем, есть ли уже статистика для этого трека
        exists = session.query(TrackStats).filter_by(track_id=track_id).first()
        if not exists and track_id not in added_track_ids:
            session.add(TrackStats(
                id=str(uuid.uuid4()),
                track_id=track_id,
                play_count=random.randint(0, 5000),
                like_count=random.randint(0, 2000)
            ))
            added_track_ids.add(track_id)
    session.commit()

    # Генерация статистики по плейлистам
    added_playlist_ids = set()
    while len(added_playlist_ids) < playlist_count:
        playlist_id = get_playlist_id()
        # Проверяем, есть ли уже статистика для этого плейлиста
        exists = session.query(PlaylistStats).filter_by(playlist_id=playlist_id).first()
        if not exists and playlist_id not in added_playlist_ids:
            session.add(PlaylistStats(
                id=str(uuid.uuid4()),
                playlist_id=playlist_id,
                view_count=random.randint(0, 8000),
                like_count=random.randint(0, 3000)
            ))
            added_playlist_ids.add(playlist_id)
    session.commit()