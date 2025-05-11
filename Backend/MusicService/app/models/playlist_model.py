import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.track_playlist import track_playlist

class Playlist(Base):
    __tablename__ = 'playlists'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    tracks = relationship(
        "Track",
        secondary=track_playlist,
        back_populates="playlists"
    )
    __searchable__ = ['name']