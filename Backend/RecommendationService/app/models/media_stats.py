import uuid
from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class MediaStats(Base):
    __tablename__ = 'media_stats'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_id = Column(UUID(as_uuid=True), nullable=False)
    media_type = Column(String, nullable=False)  # "track" | "playlist"
    play_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)

    __table_args__ = (
        UniqueConstraint('media_id', 'media_type', name='_media_stats_uc'),
    )