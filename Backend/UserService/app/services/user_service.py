import uuid
from sqlalchemy.exc import SQLAlchemyError
from app.database.database import get_session
from app.models.user_model import User


def get_user_by_id(user_id: uuid.UUID) -> dict | None:
    session = get_session()
    try:
        user = session.query(User).filter_by(id=user_id).first()
        if user:
            return {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "bio": user.bio,
                "avatar_url": user.avatar_url,
            }
        return None
    except SQLAlchemyError as e:
        print(f"[get_user_by_id] DB Error: {e}")
        return None
    finally:
        session.close()


def get_user_by_email(email: str) -> dict | None:
    session = get_session()
    try:
        user = session.query(User).filter_by(email=email).first()
        if user:
            return {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "bio": user.bio,
                "avatar_url": user.avatar_url,
            }
        return None
    except SQLAlchemyError as e:
        print(f"[get_user_by_email] DB Error: {e}")
        return None
    finally:
        session.close()


def create_user(user_data: dict) -> uuid.UUID | None:
    session = get_session()
    try:
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            password_hash=user_data["password_hash"],
            role=user_data.get("role", "user"),
            bio=user_data.get("bio", ""),
            avatar_url=user_data.get("avatar_url", "")
        )
        session.add(user)
        session.commit()
        return user.id
    except SQLAlchemyError as e:
        session.rollback()
        print(f"[create_user] DB Error: {e}")
        return None
    finally:
        session.close()


def update_user(user_id: uuid.UUID, updates: dict) -> bool:
    session = get_session()
    try:
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return False

        for key, value in updates.items():
            if hasattr(user, key):
                setattr(user, key, value)

        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        print(f"[update_user] DB Error: {e}")
        return False
    finally:
        session.close()


def delete_user(user_id: uuid.UUID) -> bool:
    session = get_session()
    try:
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return False
        session.delete(user)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        print(f"[delete_user] DB Error: {e}")
        return False
    finally:
        session.close()
