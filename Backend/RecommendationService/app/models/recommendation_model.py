import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Recommendation(Base):
    __tablename__ = 'recommendations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    media_id = Column(UUID(as_uuid=True), nullable=False)
    media_type = Column(String, nullable=False)  # "track" | "playlist"
    recommended_at = Column(DateTime, default=datetime.utcnow, nullable=False)