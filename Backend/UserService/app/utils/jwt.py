from datetime import datetime, timedelta
from uuid import UUID

from jose import JWTError, jwt

from app.database.database import db
from app.models.user_model import User
from app.utils.config import get_settings

settings = get_settings()

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def get_user_from_token(token: str) -> User | None:
    try:
        # Декодируем токен
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options = {"verify_exp": False}
        )

        # Получаем ID пользователя из токена
        user_id = payload.get("sub")
        if not user_id:
            return None

        return db.session.get(User, UUID(user_id))

    except (JWTError, ValueError, Exception) as e:
        return None