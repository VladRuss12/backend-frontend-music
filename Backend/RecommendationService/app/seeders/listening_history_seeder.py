from faker import Faker
from app.models.history_model import ListeningHistory
from app.seeders.utils import get_user_id, get_track_id

fake = Faker()

def generate_listening_history_seed(session, amount: int = 10):
    for _ in range(amount):
        session.add(
            ListeningHistory(
                user_id=get_user_id(),
                track_id=get_track_id(),
                timestamp=fake.date_time_this_year()
            )
        )
    session.commit()