import bcrypt
from datetime import timedelta
from app.utils.jwt import create_access_token, create_refresh_token
from app.models.user_model import UserModel, get_user_collection


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def register_user(username: str, email: str, password: str, role: str = "user"):
    user_col = get_user_collection()
    if user_col.find_one({"email": email}):
        raise ValueError("User already exists")

    hashed_password = hash_password(password)
    new_user = {
        "username": username,
        "email": email,
        "password_hash": hashed_password,
        "role": role,
        "bio": "",
        "avatar_url": "",
        "is_active": True
    }
    result = user_col.insert_one(new_user)
    return str(result.inserted_id)


def authenticate_user(email: str, password: str):
    user_col = get_user_collection()
    user_data = user_col.find_one({"email": email})
    if not user_data:
        return None
    if not verify_password(password, user_data["password_hash"]):
        return None
    user = UserModel.from_mongo(user_data)
    return user


def create_tokens(user: UserModel):
    user_data = {"sub": user.id, "role": user.role}
    return {
        "access_token": create_access_token(user_data),
        "refresh_token": create_refresh_token(user_data),
        "token_type": "bearer"
    }
