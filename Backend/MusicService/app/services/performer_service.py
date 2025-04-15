from app.models.performer_model import PerformerModel
from app.services.base_service import BaseService

class PerformerService(BaseService):
    model = PerformerModel
    collection_name = "performers"