import requests
from uuid import UUID

MUSIC_SERVICE_URL = "http://music-service:5002"

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

def get_playlist_by_id(playlist_id: UUID):
    response = requests.get(f"{MUSIC_SERVICE_URL}/playlists/{playlist_id}")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Playlist not found: {playlist_id}")

def get_all_playlists() -> list[dict]:
    response = requests.get(f"{MUSIC_SERVICE_URL}/playlists")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Failed to fetch all playlists")