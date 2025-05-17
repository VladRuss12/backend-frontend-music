import uuid
from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base


class PlaylistStats(Base):
    __tablename__ = 'playlist_stats'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    playlist_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
