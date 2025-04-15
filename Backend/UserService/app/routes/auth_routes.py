from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, authenticate_user, create_tokens

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        user_id = register_user(
            username=data["username"],
            email=data["email"],
            password=data["password"]
        )
        return jsonify({"message": "User registered", "user_id": user_id}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = authenticate_user(data["email"], data["password"])
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    tokens = create_tokens(user)
    return jsonify(tokens)
