from functools import wraps
from flask import request, jsonify

# Предполагаем, что роль приходит в заголовке от Auth-сервиса
def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            role = request.headers.get("X-User-Role")
            if role not in allowed_roles:
                return jsonify({"error": "Access denied"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
