from random import choice
from faker import Faker
from app.models.history_model import Like
from app.seeders.utils import get_user_id, get_track_id

fake = Faker()

def generate_like_seed(session, amount: int = 10):
    for _ in range(amount):
        session.add(
            Like(
                user_id=get_user_id(),
                track_id=get_track_id(),
                liked=choice([True, False]),
                timestamp=fake.date_time_this_year()
            )
        )
    session.commit()