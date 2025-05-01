from functools import wraps
from flask import request, jsonify
from app.utils.jwt import get_user_from_token

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get("Authorization")
            if token:
                token = token.split(" ")[1]
                user = get_user_from_token(token)
                if user:
                    if user.role not in allowed_roles:
                        return jsonify({"error": "Access denied"}), 403
                    return f(*args, **kwargs)
            return jsonify({"error": "Unauthorized"}), 401
        return wrapper
    return decorator
