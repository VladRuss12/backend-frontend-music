import requests
from uuid import UUID

USER_SERVICE_URL = "http://localhost:5001"

def get_user_by_id(user_id: UUID):
    response = requests.get(f"{USER_SERVICE_URL}/users/{user_id}")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"User not found: {user_id}")
