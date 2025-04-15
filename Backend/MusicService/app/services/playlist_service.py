from app.models.playlist_model import PlaylistModel
from app.services.base_service import BaseService

class PlaylistService(BaseService):
    model = PlaylistModel
    collection_name = "playlists"
