import uuid
from faker import Faker
from sqlalchemy.orm import Session

from app.models.track_model import Track

fake = Faker()

def track_seeder(session: Session, performers, count=30):
    tracks = []
    for _ in range(count):
        performer = fake.random_element(elements=performers)
        track = Track(
            id=uuid.uuid4(),
            title=fake.sentence(nb_words=3),
            performer_id=performer.id,
            album=fake.word(),
            genre=performer.genre,
            duration=fake.random_int(min=120, max=400),
            file_url=fake.file_path(extension="mp3"),
            created_at=fake.date_time_this_year()
        )
        session.add(track)
        tracks.append(track)
    session.commit()
    return tracks
