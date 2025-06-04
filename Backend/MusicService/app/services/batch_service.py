from typing import List, Type
from uuid import UUID

class BatchService:
    @staticmethod
    def get_by_ids(service: Type, ids: List[UUID]):

        db_session = service.model.query.session
        items = db_session.query(service.model).filter(service.model.id.in_(ids)).all()
        return service.schema(many=True).dump(items)