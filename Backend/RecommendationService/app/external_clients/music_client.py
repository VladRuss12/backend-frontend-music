import requests
from uuid import UUID
from typing import List, Dict, Literal

MUSIC_SERVICE_URL = "http://music-service:5002"

def batch_fetch(
    entity: Literal["tracks", "playlists", "performers"],
    ids: List[str|UUID]
) -> List[Dict]:
    response = requests.post(
        f"{MUSIC_SERVICE_URL}/music/{entity}/batch",
        json={"ids": [str(i) for i in ids]}
    )
    if response.status_code == 200:
        return response.json()
    raise Exception(f"Failed to batch fetch {entity}: {ids}")

def get_tracks_by_ids(track_ids: List[str|UUID]) -> List[Dict]:
    return batch_fetch("tracks", track_ids)

def get_playlists_by_ids(playlist_ids: List[str|UUID]) -> List[Dict]:
    return batch_fetch("playlists", playlist_ids)

def get_performers_by_ids(performer_ids: List[str|UUID]) -> List[Dict]:
    return batch_fetch("performers", performer_ids)

def get_all_track_ids() -> List[UUID]:
    response = requests.get(f"{MUSIC_SERVICE_URL}/music/tracks/ids")
    if response.status_code == 200:
        return [UUID(i) for i in response.json()["ids"]]
    raise Exception("Failed to fetch all track ids")