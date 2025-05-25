from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.recommendation_model import Recommendation

class RecommendationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Recommendation
        load_instance = True

    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    track_id = fields.UUID(required=False, allow_none=True)
    playlist_id = fields.UUID(required=False, allow_none=True)
    recommended_at = fields.DateTime(dump_only=True)