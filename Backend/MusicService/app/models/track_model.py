from app.models.__init__ import *
from app.models.base import BaseMongoModel
class TrackModel(BaseMongoModel):
    id: Optional[str] = None
    title: str
    artist_id: str  # ID исполнителя или группы
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[int] = None  # Время трека в секундах
    file_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

