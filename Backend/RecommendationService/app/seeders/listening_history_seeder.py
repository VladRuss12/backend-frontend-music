from datetime import datetime
from random import choice
from faker import Faker
from app.models.history_model import ListeningHistory
from app.database.database import db
from  app.seeders.utils import get_user_id, get_track_id

fake = Faker()

# Функция для генерации сидеров для ListeningHistory
def generate_listening_history_seed(session):
    for _ in range(100):  # Генерируем 100 сидеров
        user_id = get_user_id()
        track_id = get_track_id()

        listening_history = ListeningHistory(
            user_id=user_id,
            track_id=track_id,
            timestamp=fake.date_this_year()
        )
        session.add(listening_history)

    session.commit()
    print("ListeningHistory seed data created successfully!")
