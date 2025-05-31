from marshmallow import Schema, fields
from app.models.stream_file_model import StreamFileModel

class StreamFileSchema(Schema):
    id = fields.UUID(dump_only=True)
    track_id = fields.UUID(required=True)
    filename = fields.Str(required=True)
    mimetype = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)

    class Meta:
        model = StreamFileModel