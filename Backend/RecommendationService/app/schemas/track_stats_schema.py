from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.track_stats import TrackStats

class TrackStatsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TrackStats
        load_instance = True

    id = fields.UUID(dump_only=True)
    track_id = fields.UUID(required=True)
    play_count = fields.Integer(dump_only=True)
    like_count = fields.Integer(dump_only=True)
