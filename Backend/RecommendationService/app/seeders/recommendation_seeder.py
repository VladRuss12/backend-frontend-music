from datetime import datetime
from faker import Faker
from app.models.recommendation_model import Recommendation
from app.database.database import db
from .utils import get_user_id, get_track_id

fake = Faker()

# Функция для генерации сидеров для Recommendation
def generate_recommendation_seed(session):
    for _ in range(100):  # Генерируем 100 сидеров
        user_id = get_user_id()
        track_id = get_track_id()

        recommendation = Recommendation(
            user_id=user_id,
            track_id=track_id,
            recommended_at=fake.date_this_year()
        )
        session.add(recommendation)

    session.commit()
    print("Recommendation seed data created successfully!")
