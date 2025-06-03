import bcrypt
from sqlalchemy.exc import SQLAlchemyError
from app.models.user_model import User, UserRole
from app.utils.jwt import create_access_token, create_refresh_token, decode_token

class AuthService:
    def __init__(self, session):
        self.session = session

    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    def register_user(self, username, email, password, role="user"):
        try:
            if self.session.query(User).filter_by(email=email).first():
                raise ValueError("User already exists")

            new_user = User(
                username=username,
                email=email,
                password_hash=self.hash_password(password),
                role=UserRole(role),
                bio="",
                avatar_url="",
                is_active=True
            )
            self.session.add(new_user)
            self.session.commit()
            return new_user.id
        except (SQLAlchemyError, ValueError) as e:
            self.session.rollback()
            print(f"[register_user] Error: {e}")
            return None

    def authenticate_user(self, email, password):
        try:
            user = self.session.query(User).filter_by(email=email).first()
            if not user or not self.verify_password(password, user.password_hash):
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

    def create_tokens(self, user: dict) -> dict:
        user_data = {
            "sub": user["id"],
            "role": user["role"].value if hasattr(user["role"], 'value') else user["role"]
        }
        return {
            "access_token": create_access_token(user_data),
            "refresh_token": create_refresh_token(user_data),
            "token_type": "bearer"
        }

    def refresh_tokens(self, refresh_token: str):
        payload = decode_token(refresh_token)
        if not payload or "sub" not in payload or "role" not in payload:
            return None
        user_data = {"id": payload["sub"], "role": payload["role"]}
        return self.create_tokens(user_data)