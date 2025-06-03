import uuid
import random

from app.models.media_stats import MediaStats
from app.seeders.utils import get_track_id, get_playlist_id

def generate_media_stats_seed(session, track_count: int = 10, playlist_count: int = 5):
    # Статистика по трекам
    added_media = set()
    while len(added_media) < track_count:
        media_id = get_track_id()
        media_type = "track"
        key = (media_id, media_type)
        exists = session.query(MediaStats).filter_by(media_id=media_id, media_type=media_type).first()
        if not exists and key not in added_media:
            session.add(MediaStats(
                id=uuid.uuid4(),
                media_id=media_id,
                media_type=media_type,
                play_count=random.randint(0, 5000),
                like_count=random.randint(0, 2000)
            ))
            added_media.add(key)
    session.commit()

    # Статистика по плейлистам
    while len(added_media) < track_count + playlist_count:
        media_id = get_playlist_id()
        media_type = "playlist"
        key = (media_id, media_type)
        exists = session.query(MediaStats).filter_by(media_id=media_id, media_type=media_type).first()
        if not exists and key not in added_media:
            session.add(MediaStats(
                id=uuid.uuid4(),
                media_id=media_id,
                media_type=media_type,
                play_count=random.randint(0, 8000),
                like_count=random.randint(0, 3000)
            ))
            added_media.add(key)
    session.commit()