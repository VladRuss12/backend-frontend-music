import requests
from uuid import UUID

USER_SERVICE_URL = "http://user-service:5001"

def get_users_by_ids(user_ids: list[UUID]) -> list[dict]:
    response = requests.post(
        f"{USER_SERVICE_URL}/users/batch",
        json={"ids": [str(uid) for uid in user_ids]}
    )
    if response.status_code == 200:
        return response.json()
    raise Exception(f"Failed to batch fetch users: {user_ids}")