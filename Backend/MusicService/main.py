from flask import Flask
from flask_migrate import Migrate

from app.database.config import Config
from app.database.database import db, init_db
from app.services.performer_service import PerformerService
from app.services.playlist_service import PlaylistService
from app.routes.base_router import create_crud_routes
from app.routes.wasabi_router import track_upload_bp
from app.seeders.seed import seed_all
from app.services.track_service import TrackService

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Инициализация базы данных
    init_db(app)
    migrate.init_app(app, db)

    # Регистрация маршрутов
    app.register_blueprint(create_crud_routes(PerformerService, "performers"))
    app.register_blueprint(create_crud_routes(PlaylistService, "playlists"))
    app.register_blueprint(create_crud_routes(TrackService, "tracks"))
    app.register_blueprint(track_upload_bp)

    # Команда для наполнения базы данных
    @app.cli.command("seed")
    def seed_command():
        with app.app_context():  # убедитесь, что контекст приложения активен
            seed_all()
        print("Database seeded successfully.")

    return app

if __name__ == "__main__":
    app = create_app()  # Не забывайте создавать приложение перед запуском
    app.run(host="0.0.0.0", port=5002)
