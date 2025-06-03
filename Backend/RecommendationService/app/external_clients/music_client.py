import requests
from uuid import UUID

MUSIC_SERVICE_URL = "http://music-service:5002"

def get_tracks_by_ids(track_ids: list[UUID]) -> list[dict]:
    response = requests.post(
        f"{MUSIC_SERVICE_URL}/music/tracks/batch",
        json={"ids": [str(tid) for tid in track_ids]}
    )
    if response.status_code == 200:
        return response.json()
    raise Exception(f"Failed to batch fetch tracks: {track_ids}")

def get_playlists_by_ids(playlist_ids: list[UUID]) -> list[dict]:
    response = requests.post(
        f"{MUSIC_SERVICE_URL}/music/playlists/batch",
        json={"ids": [str(pid) for pid in playlist_ids]}
    )
    if response.status_code == 200:
        return response.json()
    raise Exception(f"Failed to batch fetch playlists: {playlist_ids}")


def get_all_track_ids() -> list[UUID]:
    response = requests.get(f"{MUSIC_SERVICE_URL}/music/tracks/ids")
    if response.status_code == 200:
        return [UUID(i) for i in response.json()["ids"]]
    raise Exception("Failed to fetch all track ids")

