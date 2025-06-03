from flask import Blueprint, jsonify, request
from uuid import UUID

from app.services.recommendation_service import RecommendationService
from app.database.database import get_session
from app.schemas.recommendation_schema import RecommendationSchema

recommendation_bp = Blueprint('recommendation', __name__, url_prefix="/recommendations")
recommendation_list_schema = RecommendationSchema(many=True)

@recommendation_bp.get("/user")
def recommend_for_user():
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        return jsonify({"message": "Missing X-User-ID header"}), 401
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        return jsonify({"message": "Invalid UUID in X-User-ID header"}), 400

    entity_type = request.args.get("media_type", "track")
    service = RecommendationService(get_session())
    recommendations = service.recommend_for_user(user_uuid, entity_type)
    return jsonify(recommendation_list_schema.dump(recommendations))

@recommendation_bp.get("/popular")
def get_popular():
    entity_type = request.args.get("media_type", "track")
    limit = int(request.args.get("limit", 10))

    service = RecommendationService(get_session())
    try:
        popular = service.get_most_popular(entity_type=entity_type, limit=limit)
    except ValueError:
        return jsonify({"message": "Unsupported media_type"}), 400

    return jsonify(recommendation_list_schema.dump(popular))