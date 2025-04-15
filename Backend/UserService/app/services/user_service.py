from bson import ObjectId
from app.models.user_model import get_user_collection, UserModel


def get_user_by_id(user_id: ObjectId) -> dict | None:
    user = get_user_collection().find_one({"_id": user_id})
    if user:
        # Преобразуем _id в id
        user["id"] = str(user["_id"])
        del user["_id"]  # Удаляем _id, чтобы избежать дублирования
        return UserModel(**user).dict(by_alias=True)  # Используем метод from_mongo для сериализации
    return None


def get_user_by_email(email: str) -> dict | None:
    user = get_user_collection().find_one({"email": email})
    return user


def create_user(user_data: dict) -> ObjectId:
    """Создаёт нового пользователя и возвращает его ObjectId"""
    result = get_user_collection().insert_one(user_data)
    return result.inserted_id


def update_user(user_id: ObjectId, updates: dict) -> bool:
    """Обновляет пользователя. Возвращает True, если что-то было обновлено"""
    result = get_user_collection().update_one(
        {"_id": user_id},
        {"$set": updates}
    )
    return result.modified_count > 0


def delete_user(user_id: ObjectId) -> bool:
    """Удаляет пользователя по ID. Возвращает True, если пользователь был удалён"""
    result = get_user_collection().delete_one({"_id": user_id})
    return result.deleted_count > 0
