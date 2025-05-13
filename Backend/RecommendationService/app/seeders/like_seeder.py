from datetime import datetime
from random import choice
from faker import Faker
from app.models.history_model import Like
from app.database.database import db
from app.seeders.utils import get_user_id, get_track_id

fake = Faker()

# Функция для генерации сидеров для Like
def generate_like_seed(session):

    for _ in range(100):  # Генерируем 100 сидеров
        user_id = get_user_id()
        track_id = get_track_id()

        like = Like(
            user_id=user_id,
            track_id=track_id,
            liked=choice([True, False]),
            timestamp=fake.date_this_year()
        )
        session.add(like)

    session.commit()
    print("Like seed data created successfully!")
