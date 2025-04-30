from app.models.track_model import Track
from app.schemas.track_schema import TrackSchema
from app.services.base_service import BaseService

class TrackService(BaseService):
    model = Track
    schema = TrackSchema
