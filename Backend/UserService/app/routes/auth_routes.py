from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, authenticate_user, create_tokens
from app.database.database import get_session
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    session: Session = get_session()

    try:
        user_id = register_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            session=session
        )
        return jsonify({"message": "User registered", "user_id": user_id}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    session: Session = get_session()

    try:
        user = authenticate_user(data["email"], data["password"], session)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        tokens = create_tokens(user)
        return jsonify(tokens)

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
