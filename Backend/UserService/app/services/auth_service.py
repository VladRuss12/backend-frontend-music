import bcrypt
import uuid
from sqlalchemy.exc import SQLAlchemyError
from app.utils.jwt import create_access_token, create_refresh_token
from app.models.user_model import User, UserRole
from sqlalchemy.orm import Session


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def register_user(username: str, email: str, password: str, session: Session, role: str = "user") -> uuid.UUID | None:
    try:
        if session.query(User).filter_by(email=email).first():
            raise ValueError("User already exists")

        new_user = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            role=UserRole(role),
            bio="",
            avatar_url="",
            is_active=True
        )
        session.add(new_user)
        session.commit()
        return new_user.id
    except (SQLAlchemyError, ValueError) as e:
        session.rollback()
        print(f"[register_user] Error: {e}")
        return None


def authenticate_user(email: str, password: str, session: Session) -> dict | None:
    try:
        user = session.query(User).filter_by(email=email).first()
        if not user or not verify_password(password, user.password_hash):
            return None
        return {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    except SQLAlchemyError as e:
        print(f"[authenticate_user] DB Error: {e}")
        return None


def create_tokens(user: dict) -> dict:
    user_data = {
        "sub": user["id"],
        "role": user["role"].value
    }
    return {
        "access_token": create_access_token(user_data),
        "refresh_token": create_refresh_token(user_data),
        "token_type": "bearer"
    }