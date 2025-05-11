# app/services/search_service.py
from app.models.playlist_model import Playlist
from app.models.performer_model import Performer
from app.models.track_model import Track
from app.schemas.playlist_schema import PlaylistSchema
from app.schemas.performer_schema import PerformerSchema
from app.schemas.track_schema import TrackSchema

class SearchService:
    def __init__(self, query):
        self.query = query
        self.playlist_schema = PlaylistSchema(many=True)
        self.track_schema = TrackSchema(many=True)
        self.performer_schema = PerformerSchema(many=True)

    def search_playlists(self):
        playlists = Playlist.query.whoosh_search(self.query).all()
        return self.playlist_schema.dump(playlists)

    def search_performers(self):
        performers = Performer.query.whoosh_search(self.query).all()
        return self.performer_schema.dump(performers)

    def search_tracks(self):
        tracks = Track.query.whoosh_search(self.query).all()
        return self.track_schema.dump(tracks)

    def search(self):
        playlists = self.search_playlists()
        tracks = self.search_tracks()
        performers = self.search_performers()
        return {
            "playlists": playlists,
            "tracks": tracks,
            "performers": performers
        }
