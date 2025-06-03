from flask import Blueprint, request, jsonify
from uuid import UUID

from app.services.listening_service import ListeningService
from app.services.common_user_data import get_history_by_user, get_liked_entities
from app.schemas.history_schema import HistorySchema
from app.schemas.like_schema import LikeSchema
from app.database.database import get_session

listening_bp = Blueprint("listening", __name__, url_prefix="/recommendations/listening")

history_schema = HistorySchema()
like_schema = LikeSchema()
history_list_schema = HistorySchema(many=True)
like_list_schema = LikeSchema(many=True)

def get_user_id_from_header() -> UUID | tuple:
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        return jsonify({"message": "Missing X-User-ID header"}), 401
    try:
        return UUID(user_id)
    except ValueError:
        return jsonify({"message": "Invalid UUID in X-User-ID header"}), 400

@listening_bp.post("/history")
def add_history():
    user_id = get_user_id_from_header()
    if isinstance(user_id, tuple):
        return user_id

    data = request.get_json()
    media_id = UUID(data["media_id"])
    media_type = data.get("media_type", "track")

    service = ListeningService(get_session(), media_type)
    history = service.add_history(user_id, media_id)
    return jsonify(history_schema.dump(history))

@listening_bp.post("/like")
def like_entity():
    user_id = get_user_id_from_header()
    if isinstance(user_id, tuple):
        return user_id

    data = request.get_json()
    media_id = UUID(data["media_id"])
    media_type = data.get("media_type", "track")

    service = ListeningService(get_session(), media_type)
    like = service.like_media(user_id, media_id)
    return jsonify(like_schema.dump(like))

@listening_bp.post("/unlike")
def unlike_entity():
    user_id = get_user_id_from_header()
    if isinstance(user_id, tuple):
        return user_id

    data = request.get_json()
    media_id = UUID(data["media_id"])
    media_type = data.get("media_type", "track")

    service = ListeningService(get_session(), media_type)
    like = service.unlike_media(user_id, media_id)
    if like:
        return jsonify(like_schema.dump(like))
    else:
        return jsonify({"message": "Like not found"}), 404

@listening_bp.get("/history")
def get_history_route():
    user_id = get_user_id_from_header()
    if isinstance(user_id, tuple):
        return user_id

    media_type = request.args.get("media_type", "track")
    session = get_session()
    history = get_history_by_user(session, user_id, media_type)
    return jsonify(history_list_schema.dump(history))

@listening_bp.get("/liked")
def get_liked_entities_route():
    user_id = get_user_id_from_header()
    if isinstance(user_id, tuple):
        return user_id

    media_type = request.args.get("media_type", "track")
    session = get_session()
    liked = get_liked_entities(session, user_id, media_type)
    return jsonify(like_list_schema.dump(liked))