from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

track_playlist = Table(
    'track_playlist',
    Base.metadata,
    Column('playlist_id', UUID(as_uuid=True), ForeignKey('playlists.id'), primary_key=True),
    Column('track_id', UUID(as_uuid=True), ForeignKey('tracks.id'), primary_key=True)
)
