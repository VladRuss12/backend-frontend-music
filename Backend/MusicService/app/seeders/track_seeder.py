from app.services.track_service import TrackService
from app.services.performer_service import PerformerService
from faker import Faker
from random import choice, randint, sample

fake = Faker()
class TrackSeeder:
    @staticmethod
    def seed():
        performers = PerformerService.get_all()
        artist_ids = [p.id for p in performers if p.type == "artist"]

        if not artist_ids:
            print("Нет артистов для треков.")
            return

        for _ in range(15):
            track = {
                "title": fake.sentence(nb_words=3).rstrip('.'),
                "artist_id": choice(artist_ids),
                "album": fake.catch_phrase(),
                "genre": fake.word(ext_word_list=["Pop", "Rock", "Jazz", "Electronic", "Indie"]),
                "duration": randint(120, 400)
            }
            TrackService.create(track)

        print("Треки успешно сгенерированы.")
