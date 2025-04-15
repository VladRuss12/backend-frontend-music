from app.seeders.performer_seeder import PerformerSeeder
from app.seeders.track_seeder import TrackSeeder
from app.seeders.playlist_seeder import PlaylistSeeder
from app.database import mongo

def seed_all():
    if mongo.db.performers.count_documents({}) == 0:
        PerformerSeeder.seed()
    if mongo.db.tracks.count_documents({}) == 0:
        TrackSeeder.seed()
    if mongo.db.playlists.count_documents({}) == 0:
        PlaylistSeeder.seed()

