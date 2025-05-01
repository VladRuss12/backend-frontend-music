import uuid
from app.models.user_model import User
from sqlalchemy.exc import SQLAlchemyError
from app.schemas.user_schema import UserSchema
from app.database.database import get_session

def get_user_by_id(user_id: uuid.UUID) -> dict | None:
    session = get_session()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if user:
            return UserSchema().dump(user)
        return None
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return None
    finally:
        session.close()

def get_user_by_email(email: str) -> dict | None:
    session = get_session()
    try:
        user = session.query(User).filter(User.email == email).first()
        if user:
            return UserSchema().dump(user)
        return None
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return None
    finally:
        session.close()

def create_user(user_data: dict) -> uuid.UUID:
    session = get_session()
    try:
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            password_hash=user_data["password_hash"],
            role=user_data.get("role", "user"),
            bio=user_data.get("bio", ""),
            avatar_url=user_data.get("avatar_url", ""),
        )
        session.add(user)
        session.commit()
        return user.id
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return None
    finally:
        session.close()

def update_user(user_id: uuid.UUID, updates: dict) -> bool:
    session = get_session()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        for key, value in updates.items():
            if hasattr(user, key):
                setattr(user, key, value)

        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return False
    finally:
        session.close()

def delete_user(user_id: uuid.UUID) -> bool:
    session = get_session()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if user:
            session.delete(user)
            session.commit()
            return True
        return False
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error: {e}")
        return False
    finally:
        session.close()
