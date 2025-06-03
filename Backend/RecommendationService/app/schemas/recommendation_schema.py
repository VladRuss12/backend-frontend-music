from marshmallow import Schema, fields

class RecommendationSchema(Schema):
    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    media_id = fields.UUID(required=True)
    media_type = fields.Str(required=True)
    recommended_at = fields.DateTime(dump_only=True)

    media = fields.Dict()
    user = fields.Dict()