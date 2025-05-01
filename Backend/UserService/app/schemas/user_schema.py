from marshmallow import Schema, fields
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class UserSchema(Schema):
    id = fields.UUID()
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(validate=lambda x: x in UserRole.__members__)
    bio = fields.Str()
    avatar_url = fields.Str()
    created_at = fields.DateTime()
    is_active = fields.Bool()
