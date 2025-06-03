import uuid

from faker import Faker
from app.models.recommendation_model import Recommendation
from app.seeders.utils import get_user_id, get_random_media

fake = Faker()

def generate_recommendation_seed(session, amount: int = 10):
    for _ in range(amount):
        user_id = get_user_id()
        media_id, media_type = get_random_media()
        session.add(
            Recommendation(
                id=uuid.uuid4(),
                user_id=user_id,
                media_id=media_id,
                media_type=media_type,
                recommended_at=fake.date_time_this_year()
            )
        )
    session.commit()