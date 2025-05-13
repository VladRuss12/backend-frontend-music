from app.models.history_model import ListeningHistory
from app.seeders.listening_history_seeder import generate_listening_history_seed
from app.seeders.like_seeder import generate_like_seed
from app.seeders.recommendation_seeder import generate_recommendation_seed
from app.database.database import db

def check_if_seeds_exist():
    return db.session.query(ListeningHistory).count() > 0

def generate_all_seeds():
    if not check_if_seeds_exist():
        # Генерация сидеров только если данных в базе нет
        generate_listening_history_seed()
        generate_like_seed()
        generate_recommendation_seed()
        print("Сидер выполнен успешно!")
    else:
        print("Сидеры уже были выполнены, пропуск...")

