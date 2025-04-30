import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.track_playlist import track_playlist

class Track(Base):
    __tablename__ = 'tracks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    performer_id = Column(UUID(as_uuid=True), ForeignKey('performers.id'), nullable=False)
    album = Column(String)
    genre = Column(String)
    duration = Column(Integer)
    file_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    performer = relationship("Performer", back_populates="tracks")
    playlists = relationship(
        "Playlist",
        secondary=track_playlist,
        back_populates="tracks"
    )
