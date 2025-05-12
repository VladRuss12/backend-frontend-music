from app.seeders.performer_seeder import performer_seeder
from app.seeders.playlist_seeder import playlist_seeder
from app.seeders.track_seeder import track_seeder
from app.models.performer_model import Performer
from app.models.track_model import Track
from app.models.playlist_model import Playlist
from app.database.database import db


def check_if_performers_exist():
    return db.session.query(Performer).count() > 0

def check_if_tracks_exist():
    return db.session.query(Track).count() > 0

def check_if_playlists_exist():
    return db.session.query(Playlist).count() > 0


def seed_all(session):
    if not check_if_performers_exist():
        print("Seeding performers...")
        performers = performer_seeder(session)
    else:
        print("Performers already exist. Skipping seeding.")
        performers = []

    if not check_if_tracks_exist():
        print("Seeding tracks...")
        tracks = track_seeder(session, performers)
    else:
        print("Tracks already exist. Skipping seeding.")
        tracks = []

    if not check_if_playlists_exist():
        print("Seeding playlists...")
        playlist_seeder(session, tracks)
    else:
        print("Playlists already exist. Skipping seeding.")

    session.commit()
    print("All seeders executed successfully.")
