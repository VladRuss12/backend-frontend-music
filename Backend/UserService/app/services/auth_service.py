import bcrypt
from app.utils.jwt import create_access_token, create_refresh_token
from app.models.user_model import User
from sqlalchemy.exc import SQLAlchemyError
from app.schemas.user_schema import UserSchema
from app.database.database import get_session


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def register_user(username: str, email: str, password: str, role: str = "user"):
    session = get_session()
    try:
        # Проверяем, существует ли пользователь с таким email
        if session.query(User).filter(User.email == email).first():
            raise ValueError("User already exists")

        hashed_password = hash_password(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            role=role,
            bio="",
            avatar_url="",
            is_active=True
        )
        session.add(new_user)
        session.commit()

        return new_user.id  # Возвращаем ID нового пользователя

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return None
    finally:
        session.close()


def authenticate_user(email: str, password: str):
    session = get_session()
    try:
        user = session.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return UserSchema().dump(user)

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return None
    finally:
        session.close()


def create_tokens(user: UserSchema):
    user_data = {"sub": user["id"], "role": user["role"]}
    return {
        "access_token": create_access_token(user_data),
        "refresh_token": create_refresh_token(user_data),
        "token_type": "bearer"
    }
