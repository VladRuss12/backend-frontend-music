from app.database.database import db
from app.seeders.performer_seeder import performer_seeder
from app.seeders.playlist_seeder import playlist_seeder
from app.seeders.track_seeder import track_seeder

def seed_all():
    session = db.session

    print("Seeding performers...")
    performers = performer_seeder(session)

    print("Seeding tracks...")
    tracks = track_seeder(session, performers)

    print("Seeding playlists...")
    playlist_seeder(session, tracks)

    session.commit()
    print("All seeders executed successfully.")
