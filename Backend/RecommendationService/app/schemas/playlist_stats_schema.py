from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.playlist_stats import PlaylistStats

class PlaylistStatsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PlaylistStats
        load_instance = True

    id = fields.UUID(dump_only=True)
    playlist_id = fields.UUID(required=True)
    view_count = fields.Integer(dump_only=True)
    like_count = fields.Integer(dump_only=True)
