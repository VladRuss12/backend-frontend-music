from app.models.playlist_model import Playlist
from app.models.performer_model import Performer
from app.models.track_model import Track
from app.schemas.playlist_schema import PlaylistSchema
from app.schemas.performer_schema import PerformerSchema
from app.schemas.track_schema import TrackSchema
from sqlalchemy import func

class SearchService:
    def __init__(self, query):
        self.query = query
        self.playlist_schema = PlaylistSchema(many=True)
        self.track_schema = TrackSchema(many=True)
        self.performer_schema = PerformerSchema(many=True)

    def search_playlists(self):
        ts_query = func.plainto_tsquery('english', self.query)
        playlists = Playlist.query.filter(
            Playlist.search_vector.op('@@')(ts_query)
        ).all()
        return self.playlist_schema.dump(playlists)

    def search_performers(self):
        ts_query = func.plainto_tsquery('english', self.query)
        performers = Performer.query.filter(
            Performer.search_vector.op('@@')(ts_query)
        ).all()
        return self.performer_schema.dump(performers)

    def search_tracks(self):
        ts_query = func.plainto_tsquery('english', self.query)
        tracks = Track.query.filter(
            Track.search_vector.op('@@')(ts_query)
        ).all()
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