from app.models.history_model import ListeningHistory
from app.seeders.listening_history_seeder import generate_listening_history_seed
from app.seeders.like_seeder import generate_like_seed
from app.seeders.recommendation_seeder import generate_recommendation_seed
from app.seeders.media_stats_seeder import generate_media_stats_seed


def check_if_seeds_exist(session):
    return session.query(ListeningHistory).count() > 0


def generate_all_seeds(session):
    if not check_if_seeds_exist(session):
        print("Генерация ListeningHistory")
        generate_listening_history_seed(session)

        print("Генерация Likes")
        generate_like_seed(session)

        print("Генерация Recommendations")
        generate_recommendation_seed(session)

        print("Генерация Track и Playlist Stats")
        generate_media_stats_seed(session)

        print("Сидер выполнен успешно!")
    else:
        print("Сидеры уже были выполнены, пропуск...")
