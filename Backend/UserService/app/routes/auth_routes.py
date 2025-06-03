from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.database.database import db
from sqlalchemy.exc import SQLAlchemyError

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    service = AuthService(db.session)
    try:
        user_id = service.register_user(
            username=data["username"],
            email=data["email"],
            password=data["password"]
        )
        if not user_id:
            return jsonify({"error": "User already exists"}), 400
        return jsonify({"message": "User registered", "user_id": str(user_id)}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    service = AuthService(db.session)
    try:
        user = service.authenticate_user(data["email"], data["password"])
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        tokens = service.create_tokens(user)
        return jsonify(tokens), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    data = request.get_json()
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Refresh token required"}), 400

    service = AuthService(db.session)
    tokens = service.refresh_tokens(refresh_token)
    if not tokens:
        return jsonify({"error": "Invalid refresh token"}), 401
    return jsonify(tokens), 200