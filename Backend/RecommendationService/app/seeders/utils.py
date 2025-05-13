import uuid
import requests
from random import choice


def get_user_id():
    try:
        response = requests.get('http://localhost:5001/users')
        if response.status_code == 200:
            return choice(response.json())['id']
    except requests.exceptions.RequestException:
        pass
    return uuid.uuid4()


def get_track_id():
    try:
        response = requests.get('http://localhost:5002/tracks')
        if response.status_code == 200:
            return choice(response.json())['id']
    except requests.exceptions.RequestException:
        pass
    return uuid.uuid4()
