import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class ListeningHistory(Base):
    __tablename__ = 'listening_history'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    media_id = Column(UUID(as_uuid=True), nullable=False)
    media_type = Column(String, nullable=False)  # "track" | "playlist"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)