import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import JSONB, UUID, TSVECTOR
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.enums import PerformerType

class Performer(Base):
    __tablename__ = 'performers'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(Enum(PerformerType), nullable=False)
    genre = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    members = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

    search_vector = Column(TSVECTOR)

    tracks = relationship("Track", back_populates="performer")