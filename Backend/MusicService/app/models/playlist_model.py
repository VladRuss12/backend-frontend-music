from app.models.__init__ import *
from app.models.base import BaseMongoModel

class PlaylistModel(BaseMongoModel):
    id: Optional[str] = None
    name: str
    user_id: str  # ID пользователя, который создал плейлист
    track_ids: List[str]  # Список ID треков
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

