from app.models.performer_model import Performer
from app.schemas.performer_schema import PerformerSchema
from app.services.base_service import BaseService

class PerformerService(BaseService):
    model = Performer
    schema = PerformerSchema
