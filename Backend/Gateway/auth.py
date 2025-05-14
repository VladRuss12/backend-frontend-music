from jose import jwt, JWTError, ExpiredSignatureError
from functools import wraps
from flask import request, jsonify
from config import get_settings

settings = get_settings()


def jwt_required(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            # Проверка заголовка Authorization
            if 'Authorization' in request.headers:
                try:
                    token = request.headers['Authorization'].split(" ")[1]
                except:
                    return jsonify({"error": "Invalid token format"}), 401

            if not token:
                if roles:  # Если требуются роли — токен обязателен
                    return jsonify({"error": "Token is missing"}), 401
                else:
                    return f(*args, **kwargs)  # Гостевой доступ

            try:
                # Декодирование токена
                payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
                request.current_user = payload.get("sub")
                user_role = payload.get("role")

                # Если роль обязательна — проверим
                if roles and user_role not in roles:
                    return jsonify({"error": "Insufficient permissions"}), 403

            except ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except JWTError:
                return jsonify({"error": "Invalid token"}), 401

            return f(*args, **kwargs)

        return decorated

    return decorator
