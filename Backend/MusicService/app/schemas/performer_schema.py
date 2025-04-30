from marshmallow import Schema, fields
from app.models.performer_model import Performer
from app.models.enums import PerformerType

class PerformerSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True)
    type = fields.Str(required=True)
    genre = fields.Str()
    bio = fields.Str()
    avatar_url = fields.Str()
    members = fields.List(fields.Str())  # Список участников
    created_at = fields.DateTime()

    class Meta:
        model = Performer
