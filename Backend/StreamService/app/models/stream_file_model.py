import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, LargeBinary
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base

class StreamFileModel(Base):
    __tablename__ = 'stream_files'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    track_id = Column(UUID(as_uuid=True), nullable=False)
    filename = Column(String, nullable=False)
    data = Column(LargeBinary, nullable=False)
    mimetype = Column(String, nullable=False, default='audio/mpeg')
    created_at = Column(DateTime, default=datetime.utcnow)