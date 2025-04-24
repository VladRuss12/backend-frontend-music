from flask import Flask

from app.config import Config
from app.database import init_db
from app.services.performer_service import PerformerService
from app.services.playlist_service import PlaylistService
from app.routes.base_router import create_crud_routes
from app.routes.track_routes import track_bp

from app.seeders.seed import seed_all
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Загружаем конфигурацию из Config
    init_db(app)  # Инициализируем PyMongo

    # Регистрируем CRUD маршруты
    app.register_blueprint(create_crud_routes(PerformerService, "performers"))
    app.register_blueprint(create_crud_routes(PlaylistService, "playlists"))

    # Track — объединённый маршрутизатор
    app.register_blueprint(track_bp)

    seed_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5002)
