import uuid

from faker import Faker
from app.models.history_model import ListeningHistory
from app.seeders.utils import get_user_id, get_random_media

fake = Faker()

def generate_listening_history_seed(session, amount: int = 10):
    for _ in range(amount):
        user_id = get_user_id()
        media_id, media_type = get_random_media()
        session.add(
            ListeningHistory(
                id=uuid.uuid4(),
                user_id=user_id,
                media_id=media_id,
                media_type=media_type,
                timestamp=fake.date_time_this_year()
            )
        )
    session.commit()