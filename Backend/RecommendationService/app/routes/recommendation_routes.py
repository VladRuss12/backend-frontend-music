from flask import Blueprint, jsonify
from uuid import UUID
from app.services.recommendation_service import RecommendationService
from app.database.database import get_session
from app.schemas.recommendation_schema import RecommendationSchema

recommendation_bp = Blueprint('recommendation', __name__, url_prefix="/recommendations")

recommendation_list_schema = RecommendationSchema(many=True)

@recommendation_bp.get("/<user_id>")
def recommend_for_user(user_id):
    user_uuid = UUID(user_id)
    service = RecommendationService(get_session())
    recommendations = service.recommend_for_user(user_uuid)
    return recommendation_list_schema.jsonify(recommendations)
