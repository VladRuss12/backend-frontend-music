import requests
from uuid import UUID

MUSIC_SERVICE_URL = "http://localhost:5003"

def get_track_by_id(track_id: UUID):
    response = requests.get(f"{MUSIC_SERVICE_URL}/tracks/{track_id}")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Track not found: {track_id}")

def get_all_tracks() -> list[dict]:
    response = requests.get(f"{MUSIC_SERVICE_URL}/tracks")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Failed to fetch all tracks")
