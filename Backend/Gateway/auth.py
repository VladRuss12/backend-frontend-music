import jwt
from functools import wraps
from flask import request, jsonify
from config import get_settings

settings = get_settings()

def jwt_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Проверяем заголовок Authorization
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except:
                return jsonify({"error": "Invalid token format"}), 401

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Декодируем токен
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            request.current_user = payload['sub']  # Добавляем user_id в request
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
