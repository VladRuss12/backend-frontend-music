from flask import Blueprint, request, jsonify
from app.database.database import db
from app.models.user_model import User
from app.services.user_service import get_user_by_id, update_user
from app.schemas.user_schema import UserSchema
from app.utils.roles import role_required
from flask_jwt_extended import jwt_required, get_jwt_identity
from uuid import UUID

bp = Blueprint("users", __name__)

@bp.route("/<uuid:user_id>", methods=["GET"])
def get_user(user_id: UUID):
    user = get_user_by_id(user_id, db.session)  # передаем сессию
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user), 200

@bp.route("/all_users", methods=["GET"])
def get_all_users():
    users = db.session.query(User).all()  # Получаем всех пользователей
    if not users:
        return jsonify({"msg": "No users found"}), 404

    user_list = [UserSchema().dump(user) for user in users]
    return jsonify(user_list), 200

@bp.route("/<uuid:user_id>", methods=["PUT"])
@role_required(["admin", "user", "artist"])
def update(user_id: UUID):
    updates = request.get_json()

    # Валидация данных
    partial_user = UserSchema().load(updates, partial=True)

    if not partial_user:
        return jsonify({"error": "Invalid data"}), 400

    # Обновление пользователя
    updated = update_user(user_id, partial_user, db.session)  # передаем сессию
    if not updated:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"msg": "User updated"}), 200

@bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()

    # Получаем данные текущего пользователя
    user = get_user_by_id(UUID(user_id), db.session)  # передаем сессию
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user), 200
