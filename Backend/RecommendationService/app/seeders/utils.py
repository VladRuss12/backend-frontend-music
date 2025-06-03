import requests
from random import choice


def get_user_id():
    try:
        response = requests.get('http://user-service:5001/users/')
        if response.status_code == 200:
            return choice(response.json())['id']
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to get tracks: {e}")


def get_track_id():
    try:
        response = requests.get('http://music-service:5002/music/tracks/')
        response.raise_for_status()
        tracks = response.json()
        if not tracks:
            raise RuntimeError("No tracks found")
        return choice(tracks)['id']
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to get tracks: {e}")

def get_playlist_id():
    try:
        response = requests.get('http://music-service:5002/music/playlists/')
        response.raise_for_status()
        playlists = response.json()
        if not playlists:
            raise RuntimeError("No playlists found")
        return choice(playlists)['id']
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to get playlists: {e}")

MEDIA_TYPES = ["track", "playlist"]
def get_random_media():
    media_type = choice(MEDIA_TYPES)
    if media_type == "track":
        return get_track_id(), "track"
    else:
        return get_playlist_id(), "playlist"
