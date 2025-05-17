from flask import Blueprint, request, jsonify
from uuid import UUID

from app.services.common_user_data import get_liked_entities, get_history_by_user
from app.services.listening_service import ListeningService
from app.database.database import get_session
from app.schemas.like_schema import LikeSchema
from app.schemas.history_schema import HistorySchema

listening_bp = Blueprint('listening', __name__, url_prefix="/listening")

history_schema = HistorySchema()
like_schema = LikeSchema()
history_list_schema = HistorySchema(many=True)
like_list_schema = LikeSchema(many=True)

@listening_bp.post("/history")
def add_history():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    entity_id = UUID(data["entity_id"])  # track_id или playlist_id
    entity_type = data.get("entity_type", "track")  # По умолчанию "track"

    service = ListeningService(get_session())
    if entity_type == "track":
        history = service.add_history(user_id, entity_id)
    elif entity_type == "playlist":
        history = service.add_playlist_history(user_id, entity_id)
    else:
        return jsonify({"message": "Unsupported entity_type"}), 400

    return history_schema.jsonify(history)

@listening_bp.post("/like")
def like_entity():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    entity_id = UUID(data["entity_id"])
    entity_type = data.get("entity_type", "track")

    service = ListeningService(get_session())
    if entity_type == "track":
        like = service.like_track(user_id, entity_id)
    elif entity_type == "playlist":
        like = service.like_playlist(user_id, entity_id)
    else:
        return jsonify({"message": "Unsupported entity_type"}), 400

    return like_schema.jsonify(like)

@listening_bp.post("/unlike")
def unlike_entity():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    entity_id = UUID(data["entity_id"])
    entity_type = data.get("entity_type", "track")

    service = ListeningService(get_session())
    if entity_type == "track":
        like = service.unlike_track(user_id, entity_id)
    elif entity_type == "playlist":
        like = service.unlike_playlist(user_id, entity_id)
    else:
        return jsonify({"message": "Unsupported entity_type"}), 400

    if like:
        return like_schema.jsonify(like)
    else:
        return jsonify({"message": "Like not found"}), 404

@listening_bp.get("/history")
def get_history():
    user_id = UUID(request.args.get("user_id"))
    entity_type = request.args.get("entity_type", "track")

    session = get_session()
    history = get_history_by_user(session, user_id, entity_type)

    if not history:
        return jsonify({"message": "History not found"}), 404

    return jsonify(history)

@listening_bp.get("/liked")
def get_liked_entities_route():
    user_id = UUID(request.args.get("user_id"))
    entity_type = request.args.get("entity_type", "track")

    session = get_session()
    liked = get_liked_entities(session, user_id, entity_type)

    if not liked:
        return jsonify({"message": f"No liked {entity_type}s found"}), 404

    return jsonify(liked)
