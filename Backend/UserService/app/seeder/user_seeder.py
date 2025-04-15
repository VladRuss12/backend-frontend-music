from app.models.user_model import get_user_collection
from app.database import mongo
from app.services.auth_service import hash_password
from datetime import datetime


def has_seed_run():
    metadata_collection = mongo.db.app_metadata
    return metadata_collection.find_one({"key": "seed_done"}) is not None


def set_seed_flag():
    metadata_collection = mongo.db.app_metadata
    metadata_collection.insert_one({"key": "seed_done", "value": True})


def seed_users():
    if has_seed_run():
        print("Seeder already ran. Skipping...")
        return

    users = [
        {
            "username": "admin",
            "email": "admin@example.com",
            "role": "admin",
            "password": "admin123",  # не забудь потом заменить или удалить
            "bio": "This is the admin user.",
            "avatar_url": "http://example.com/admin_avatar.jpg"
        },
        {
            "username": "johndoe",
            "email": "johndoe@example.com",
            "role": "user",
            "password": "johndoe123",
            "bio": "This is a regular user.",
            "avatar_url": "http://example.com/johndoe_avatar.jpg"
        },
        {
            "username": "janedoe",
            "email": "janedoe@example.com",
            "role": "artist",
            "password": "janedoe123",
            "bio": "This is an artist.",
            "avatar_url": "http://example.com/janedoe_avatar.jpg"
        }
    ]

    user_collection = get_user_collection()

    for user in users:
        if not user_collection.find_one({"email": user["email"]}):
            hashed_password = hash_password(user.pop("password"))
            user_data = {
                **user,
                "password_hash": hashed_password,
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            user_collection.insert_one(user_data)
            print(f"User {user['username']} added.")
        else:
            print(f"User {user['username']} already exists.")

    set_seed_flag()
    print("Seeding complete.")
