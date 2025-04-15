from typing import Literal

from app.models.__init__ import *
from app.models.base import BaseMongoModel


class PerformerModel(BaseMongoModel):
    id: Optional[str] = None
    name: str
    type: Literal["artist", "band"]
    genre: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    members: Optional[List[str]] = []  # Только для групп
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)