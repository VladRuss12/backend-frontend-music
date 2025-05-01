import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base


class ListeningHistory(Base):
    __tablename__ = 'listening_history'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    track_id = Column(UUID(as_uuid=True), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class Like(Base):
    __tablename__ = 'likes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    track_id = Column(UUID(as_uuid=True), nullable=False)
    liked = Column(Boolean, default=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)