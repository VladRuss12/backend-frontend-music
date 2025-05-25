from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base

class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    track_id = Column(UUID(as_uuid=True), nullable=True)
    playlist_id = Column(UUID(as_uuid=True), nullable=True)
    recommended_at = Column(DateTime, default=datetime.utcnow, nullable=False)