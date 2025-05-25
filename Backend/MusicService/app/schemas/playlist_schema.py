from marshmallow import Schema, fields
from app.models.playlist_model import Playlist
from app.schemas.track_schema import TrackSchema


class PlaylistSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    user_id = fields.UUID(required=True)
    created_at = fields.DateTime()
    tracks = fields.Nested(TrackSchema, many=True)

    class Meta:
        model = Playlist
