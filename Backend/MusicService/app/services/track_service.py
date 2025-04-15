from app.models.track_model import TrackModel
from app.services.base_service import BaseService

class TrackService(BaseService):
    model = TrackModel
    collection_name = "tracks"
