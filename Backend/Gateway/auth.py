from jose import jwt, JWTError, ExpiredSignatureError
from functools import wraps
from flask import request, jsonify, g
from config import get_settings

settings = get_settings()


def jwt_required(roles=None, inject_user_id=True):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            if 'Authorization' in request.headers:
                try:
                    token = request.headers['Authorization'].split(" ")[1]
                except:
                    return jsonify({"error": "Invalid token format"}), 401

            if not token:
                if roles:  # требуются роли — токен обязателен
                    return jsonify({"error": "Token is missing"}), 401
                else:
                    return f(*args, **kwargs)

            try:
                payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

                # Роль нужна всегда, айди — опционально
                g.current_user_role = payload.get("role")

                if inject_user_id:
                    g.current_user_id = payload.get("sub")

                if roles and g.current_user_role not in roles:
                    return jsonify({"error": "Insufficient permissions"}), 403

            except ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except JWTError:
                return jsonify({"error": "Invalid token"}), 401

            return f(*args, **kwargs)

        return decorated
    return decorator

