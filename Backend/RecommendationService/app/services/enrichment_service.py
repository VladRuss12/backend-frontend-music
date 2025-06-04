from uuid import UUID

from app.external_clients.music_client import get_tracks_by_ids, get_playlists_by_ids, get_performers_by_ids
from app.external_clients.user_client import get_users_by_ids

def normalize_ids(ids: list) -> list[str|UUID]:
    """Преобразует список id (UUID, строка UUID или dict с ключом 'id') к списку строк-UUID/UUID."""
    result = []
    for i in ids:
        if isinstance(i, dict) and "id" in i:
            result.append(i["id"])
        else:
            result.append(i)
    return result

class EnrichmentService:
    @staticmethod
    def enrich_media(media_type: str, media_ids: list[str|UUID|dict]) -> dict:
        # Нормализуем id, чтобы избавиться от проблем с форматом
        ids = normalize_ids(media_ids)
        if not ids:
            return {}

        if media_type == "track":
            tracks = get_tracks_by_ids(ids)
            # Собираем все уникальные performer_id
            performer_ids = {track["performer_id"] for track in tracks if track.get("performer_id")}
            # Получаем исполнителей
            performers = get_performers_by_ids(list(performer_ids)) if performer_ids else []
            performer_map = {str(p["id"]): p for p in performers}

            # Подмешиваем имя исполнителя в каждый трек
            for track in tracks:
                perf_id = track.get("performer_id")
                performer = performer_map.get(str(perf_id))
                if performer:
                    track["performer"] = {
                        "id": performer["id"],
                        "name": performer["name"]
                    }
                else:
                    track["performer"] = None
            return {str(obj["id"]): obj for obj in tracks}

        elif media_type == "playlist":
            objs = get_playlists_by_ids(ids)
            return {str(obj["id"]): obj for obj in objs}
        else:
            raise ValueError(f"Unsupported media_type: {media_type}")

    @staticmethod
    def enrich_users(user_ids: list[str|UUID|dict]) -> dict:
        ids = normalize_ids(user_ids)
        if not ids:
            return {}
        users = get_users_by_ids(ids)
        return {str(u["id"]): u for u in users}