from uuid import UUID

from app.external_clients.music_client import get_tracks_by_ids, get_playlists_by_ids
from app.external_clients.user_client import get_users_by_ids

class EnrichmentService:
    @staticmethod
    def enrich_media(media_type: str, media_ids: list[str|UUID]) -> dict:
        if not media_ids:
            return {}
        if media_type == "track":
            objs = get_tracks_by_ids(media_ids)
        elif media_type == "playlist":
            objs = get_playlists_by_ids(media_ids)
        else:
            raise ValueError(f"Unsupported media_type: {media_type}")
        return {str(obj["id"]): obj for obj in objs}

    @staticmethod
    def enrich_users(user_ids: list[str|UUID]) -> dict:
        if not user_ids:
            return {}
        users = get_users_by_ids(user_ids)
        return {str(u["id"]): u for u in users}