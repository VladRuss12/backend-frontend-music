from flask import Blueprint, request, jsonify
from app.services.user_service import *
from app.models.user_model import UserModel
from app.utils.roles import role_required
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("users", __name__)

@bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(ObjectId(user_id))  # преобразуем ID в ObjectId
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user), 200  # сериализация через модель


@bp.route("/all_users", methods=["GET"])
def get_all_users():
    users = get_user_collection().find()  # Получаем всех пользователей из коллекции
    user_list = []

    for user in users:
        # Преобразуем _id в id перед созданием модели
        user["id"] = str(user["_id"])
        del user["_id"]  # Удаляем _id, чтобы избежать дублирования

        # Создаем модель с обновленными данными
        user_list.append(UserModel(**user).dict(by_alias=True))

    if user_list:
        return jsonify(user_list), 200  # Возвращаем список пользователей
    else:
        return jsonify({"msg": "No users found"}), 404  # Если пользователей нет


@bp.route("/<user_id>", methods=["PUT"])
@role_required(["admin", "user", "artist"])
def update(user_id):
    updates = request.get_json()
    try:
        # Валидация только изменяемых данных (частично)
        partial_user = UserModel(**updates)
        update_user(ObjectId(user_id), partial_user.dict(exclude_unset=True, by_alias=True))
        return jsonify({"msg": "User updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = get_user_by_id(ObjectId(user_id))

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user), 200
