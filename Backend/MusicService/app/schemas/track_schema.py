from marshmallow import Schema, fields
from app.models.track_model import Track

class TrackSchema(Schema):
    id = fields.UUID(dump_only=True)
    title = fields.Str(required=True)
    performer_id = fields.UUID(required=True)
    album = fields.Str()
    genre = fields.Str()
    duration = fields.Int()
    file_url = fields.Str()
    created_at = fields.DateTime()

    class Meta:
        model = Track
