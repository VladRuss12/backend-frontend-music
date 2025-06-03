from marshmallow import Schema, fields

class MediaStatsSchema(Schema):
    id = fields.UUID(dump_only=True)
    media_id = fields.UUID(required=True)
    media_type = fields.Str(required=True)
    play_count = fields.Integer(dump_only=True)
    like_count = fields.Integer(dump_only=True)

    media = fields.Dict()