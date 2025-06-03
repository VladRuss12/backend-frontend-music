from marshmallow import Schema, fields

class HistorySchema(Schema):
    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    media_id = fields.UUID(required=True)
    media_type = fields.Str(required=True)
    timestamp = fields.DateTime(dump_only=True)

    media = fields.Dict()
    user = fields.Dict()