from flask import Blueprint, request, jsonify
from app.database.database import db
from app.services.user_service import (
    get_user_by_id,
    get_all_users,
    update_user,
    delete_user
)
from app.schemas.user_schema import UserSchema
from app.utils.roles import role_required
from flask_jwt_extended import jwt_required, get_jwt_identity
from uuid import UUID

users_bp = Blueprint("users", __name__)

@users_bp.route("/<uuid:user_id>", methods=["GET"])
def get_user(user_id: UUID):
    user = get_user_by_id(user_id, db.session)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(UserSchema().dump(user)), 200

@users_bp.route("/", methods=["GET"])
def get_all():
    users = get_all_users(db.session)
    if not users:
        return jsonify({"msg": "No users found"}), 404
    return jsonify(UserSchema(many=True).dump(users)), 200

@users_bp.route("/<uuid:user_id>", methods=["PUT"])
@role_required(["admin", "user", "artist"])
def update(user_id: UUID):
    updates = request.get_json()

    try:
        partial_user = UserSchema().load(updates, partial=True)
    except Exception as e:
        return jsonify({"error": "Invalid data", "details": str(e)}), 400

    updated = update_user(user_id, partial_user, db.session)
    if not updated:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"msg": "User updated"}), 200

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = get_user_by_id(UUID(user_id), db.session)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(UserSchema().dump(user)), 200

@users_bp.route("/<uuid:user_id>", methods=["DELETE"])
@role_required(["admin"])
def delete(user_id: UUID):
    deleted = delete_user(user_id, db.session)
    if not deleted:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"msg": "User deleted"}), 200