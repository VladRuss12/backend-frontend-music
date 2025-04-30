from app.models.playlist_model import Playlist
from app.schemas.playlist_schema import PlaylistSchema
from app.services.base_service import BaseService

class PlaylistService(BaseService):
    model = Playlist
    schema = PlaylistSchema
