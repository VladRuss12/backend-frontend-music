from pydantic import ValidationError

from app.database import mongo

class BaseService:
    model = None
    collection_name = None

    @classmethod
    def get_collection(cls):
        return getattr(mongo.db, cls.collection_name)

    @classmethod
    def get_all(cls):
        docs = cls.get_collection().find()
        return [cls.model.from_mongo(doc) for doc in docs]

    @classmethod
    def get_by_id(cls, object_id: str):
        doc = cls.get_collection().find_one({"_id": mongo.to_object_id(object_id)})
        return cls.model.from_mongo(doc) if doc else None

    @classmethod
    def create(cls, data: dict):
        try:
            # Валидируем входящие данные
            model_instance = cls.model(**data)
            validated_data = model_instance.dict(exclude_unset=True)

            # Сохраняем в базу только валидные данные
            result = cls.get_collection().insert_one(validated_data)
            return str(result.inserted_id)

        except ValidationError as e:
            raise e

    @classmethod
    def update(cls, object_id: str, data: dict):
        result = cls.get_collection().update_one(
            {"_id": mongo.to_object_id(object_id)},
            {"$set": data}
        )
        return result.modified_count

    @classmethod
    def delete(cls, object_id: str):
        result = cls.get_collection().delete_one({"_id": mongo.to_object_id(object_id)})
        return result.deleted_count
