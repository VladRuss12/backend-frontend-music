import uuid
from random import choice
from faker import Faker
from app.models.like_model import Like
from app.seeders.utils import get_user_id, get_random_media

fake = Faker()

def generate_like_seed(session, amount: int = 10):
    for _ in range(amount):
        user_id = get_user_id()
        media_id, media_type = get_random_media()
        session.add(
            Like(
                id=uuid.uuid4(),
                user_id=user_id,
                media_id=media_id,
                media_type=media_type,
                liked=choice([True, False]),
                timestamp=fake.date_time_this_year()
            )
        )
    session.commit()