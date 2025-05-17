# app/models/track_stats.py
from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.models.base import Base

class TrackStats(Base):
    __tablename__ = 'track_stats'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    track_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    play_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
