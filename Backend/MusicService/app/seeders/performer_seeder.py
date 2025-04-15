from faker import Faker
from random import choice, randint, sample
from app.services.performer_service import PerformerService

fake = Faker()

class PerformerSeeder:
    @staticmethod
    def seed():
        artists = []
        bands = []

        # Создаём 10 артистов
        for _ in range(10):
            artist = {
                "name": fake.name(),
                "type": "artist",
                "genre": fake.word(ext_word_list=["Pop", "Rock", "Jazz", "Electronic", "Indie"]),
                "bio": fake.text(max_nb_chars=100)
            }
            artist_id = PerformerService.create(artist)
            artist["id"] = artist_id
            artists.append(artist)

        # Создаём 3 группы с участниками из списка артистов
        for _ in range(3):
            members = sample(artists, k=randint(2, 4))
            band = {
                "name": fake.company() + " Band",
                "type": "band",
                "genre": fake.word(ext_word_list=["Rock", "Alternative", "Metal"]),
                "bio": fake.text(max_nb_chars=100),
                "members": [member["id"] for member in members]
            }
            PerformerService.create(band)

        print("Перформеры успешно сгенерированы.")