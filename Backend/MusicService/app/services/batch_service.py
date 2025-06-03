from uuid import UUID
from typing import List
from app.services.track_service import TrackService
from app.services.playlist_service import PlaylistService

class BatchService:
    @staticmethod
    def get_tracks_by_ids(ids: List[UUID]):
        db_session = TrackService.model.query.session
        tracks = db_session.query(TrackService.model)\
            .filter(TrackService.model.id.in_(ids)).all()
        return TrackService.schema(many=True).dump(tracks)

    @staticmethod
    def get_playlists_by_ids(ids: List[UUID]):
        db_session = PlaylistService.model.query.session
        playlists = db_session.query(PlaylistService.model)\
            .filter(PlaylistService.model.id.in_(ids)).all()
        return PlaylistService.schema(many=True).dump(playlists)