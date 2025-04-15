from app.services.playlist_service import PlaylistService
from app.services.track_service import TrackService
from faker import Faker
from random import choice, randint, sample

fake = Faker()
class PlaylistSeeder:
    @staticmethod
    def seed():
        tracks = TrackService.get_all()
        if not tracks:
            print("❌ Нет треков для плейлистов.")
            return

        track_ids = [t.id for t in tracks]

        for _ in range(5):
            playlist = {
                "name": fake.sentence(nb_words=2).rstrip('.'),
                "user_id": fake.uuid4(),  # можно заменить на существующих пользователей
                "track_ids": sample(track_ids, k=randint(3, 7))
            }
            PlaylistService.create(playlist)

        print("✅ Плейлисты успешно сгенерированы.")