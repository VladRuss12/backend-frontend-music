from faker import Faker
from app.models.recommendation_model import Recommendation
from app.seeders.utils import get_user_id, get_track_id

fake = Faker()

def generate_recommendation_seed(session, amount: int = 10):
    for _ in range(amount):
        session.add(
            Recommendation(
                user_id=get_user_id(),
                track_id=get_track_id(),
                recommended_at=fake.date_time_this_year()
            )
        )
    session.commit()