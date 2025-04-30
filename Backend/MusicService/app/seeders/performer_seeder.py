import uuid
from faker import Faker
from sqlalchemy.orm import Session
from app.models.enums import PerformerType
from app.models.performer_model import Performer

fake = Faker()

def performer_seeder(session: Session, count=10):
    performers = []
    for _ in range(count):
        p_type = PerformerType.ARTIST if fake.boolean() else PerformerType.BAND
        members = [{"name": fake.name()} for _ in range(fake.random_int(min=2, max=5))] if p_type == PerformerType.BAND else None
        performer = Performer(
            id=uuid.uuid4(),
            name=fake.name() if p_type == PerformerType.ARTIST else fake.company(),
            type=p_type,
            genre=fake.word(),
            bio=fake.text(),
            avatar_url=fake.image_url(),
            members=members,
            created_at=fake.date_time_this_decade()
        )
        session.add(performer)
        performers.append(performer)
    session.commit()
    return performers
