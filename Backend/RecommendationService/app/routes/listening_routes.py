from flask import Blueprint, request, jsonify
from uuid import UUID

from app.services.common_user_data import get_liked_tracks, get_history_by_user
from app.services.listening_service import ListeningService
from app.database.database import get_session
from app.schemas.like_schema import LikeSchema
from app.schemas.history_schema import HistorySchema

listening_bp = Blueprint('listening', __name__, url_prefix="/listening")

history_schema =HistorySchema()
like_schema = LikeSchema()
history_list_schema = HistorySchema(many=True)
like_list_schema = LikeSchema(many=True)


@listening_bp.post("/history")
def add_history():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    track_id = UUID(data["track_id"])

    service = ListeningService(get_session())
    history = service.add_history(user_id, track_id)
    return history_schema.jsonify(history)


@listening_bp.post("/like")
def like_track():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    track_id = UUID(data["track_id"])

    service = ListeningService(get_session())
    like = service.like_track(user_id, track_id)
    return like_schema.jsonify(like)


@listening_bp.post("/unlike")
def unlike_track():
    data = request.get_json()
    user_id = UUID(data["user_id"])
    track_id = UUID(data["track_id"])

    service = ListeningService(get_session())
    like = service.unlike_track(user_id, track_id)
    if like:
        return like_schema.jsonify(like)
    else:
        return jsonify({"message": "Like not found"}), 404


@listening_bp.get("/history")
def get_history():
    user_id = UUID(request.args.get("user_id"))

    session = get_session()
    history = get_history_by_user(session, user_id)

    if not history:
        return jsonify({"message": "History not found"}), 404

    return jsonify(history)  # здесь используется кастомный список словарей с обогащёнными треками


@listening_bp.get("/liked")
def get_liked_tracks_route():
    user_id = UUID(request.args.get("user_id"))

    session = get_session()
    liked_tracks = get_liked_tracks(session, user_id)

    if not liked_tracks:
        return jsonify({"message": "No liked tracks found"}), 404

    return jsonify(liked_tracks)  # здесь также обогащённый список, схемы не нужны
