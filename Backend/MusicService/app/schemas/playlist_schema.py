from marshmallow import Schema, fields
from app.models.playlist_model import Playlist

class PlaylistSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    user_id = fields.UUID(required=True)
    created_at = fields.DateTime()

    class Meta:
        model = Playlist
