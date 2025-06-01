from marshmallow import Schema, fields
from app.models.playlist_model import Playlist


class PlaylistSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    user_id = fields.UUID(required=True)
    created_at = fields.DateTime()
    tracks = fields.Method("get_track_ids")

    class Meta:
        model = Playlist

    def get_track_ids(self, obj):
        return [str(track.id) for track in getattr(obj, "tracks", [])]
