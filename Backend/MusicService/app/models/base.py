from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId


class BaseMongoModel(BaseModel):
    id: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

    @classmethod
    def from_mongo(cls, mongo_dict):
        mongo_dict['id'] = str(mongo_dict.pop('_id'))
        return cls(**mongo_dict)