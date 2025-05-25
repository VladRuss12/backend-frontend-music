from marshmallow import Schema, fields

class TrackSchema(Schema):
    id = fields.UUID()
    name = fields.Str()
    artist = fields.Str()

class HistoryEnrichedSchema(Schema):
    track = fields.Nested(TrackSchema)
    timestamp = fields.DateTime()

class RecommendationSchema(Schema):
    id = fields.UUID()
    user_id = fields.UUID()
    recommended_at = fields.DateTime()
    track = fields.Nested(TrackSchema)