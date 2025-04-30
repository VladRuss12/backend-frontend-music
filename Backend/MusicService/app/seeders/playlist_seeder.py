import uuid
from faker import Faker
from sqlalchemy.orm import Session

from app.models.playlist_model import Playlist
from app.models.track_playlist import track_playlist

fake = Faker()

def playlist_seeder(session: Session, tracks, count=5):
    playlists = []
    for _ in range(count):
        playlist = Playlist(
            id=uuid.uuid4(),
            name=fake.catch_phrase(),
            user_id=uuid.uuid4(),
            created_at=fake.date_time_this_year()
        )
        session.add(playlist)
        playlists.append(playlist)
    session.commit()

    for playlist in playlists:
        selected_tracks = fake.random_elements(elements=tracks, length=fake.random_int(min=3, max=10), unique=True)
        for track in selected_tracks:
            stmt = track_playlist.insert().values(
                playlist_id=playlist.id,
                track_id=track.id
            )
            session.execute(stmt)

    session.commit()
    return playlists
