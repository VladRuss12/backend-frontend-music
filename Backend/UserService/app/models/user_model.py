from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime
from bson import ObjectId

from app.database import mongo


class UserModel(BaseModel):
    id: str
    username: str
    email: EmailStr
    password_hash: str  # добавлено поле для хранения хэша пароля
    role: Literal["admin", "user", "artist"] = "user"
    bio: Optional[str] = ""
    avatar_url: Optional[str] = ""
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    is_active: bool = True  # например, можно использовать для бана или подтверждения

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

    @classmethod
    def from_mongo(cls, mongo_dict):
        mongo_dict['id'] = str(mongo_dict.pop('_id'))  # Преобразуем _id в id
        return cls(**mongo_dict)


def get_user_collection():
    return mongo.db.users
