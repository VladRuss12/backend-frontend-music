from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.history_model import Like

class LikeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Like
        load_instance = True

    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    track_id = fields.UUID(required=True)
    liked = fields.Boolean(required=True)
    timestamp = fields.DateTime(dump_only=True)
