from app.database import mongo
from app.models.user_model import get_user_collection

def reset_database():
    mongo.db.users.delete_many({})
    mongo.db.app_metadata.delete_many({"key": "seed_done"})
    print("Database reset complete.")

if __name__ == "__main__":
    reset_database()