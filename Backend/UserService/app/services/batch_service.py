from uuid import UUID
from typing import List
from app.models.user_model import User
from app.schemas.user_schema import UserSchema
from app.database.database import db

class BatchUserService:
    @staticmethod
    def get_users_by_ids(ids: List[UUID]):
        users = db.session.query(User).filter(User.id.in_(ids)).all()
        return UserSchema(many=True).dump(users)