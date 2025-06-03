from flask import Flask
from flask_migrate import Migrate

from app.database.config import Config
from app.database.database import db, init_db
from app.routes.batch_router import batch_bp
from app.services.performer_service import PerformerService
from app.services.playlist_service import PlaylistService
from app.routes.base_router import create_crud_routes
from app.seeders.seed import seed_all
from app.services.track_service import TrackService
from app.routes.search_router import search_router

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Migrate(app, db)
    init_db(app)

    app.register_blueprint(create_crud_routes(PerformerService, "/music/performers"))
    app.register_blueprint(create_crud_routes(PlaylistService, "/music/playlists"))
    app.register_blueprint(create_crud_routes(TrackService, "/music/tracks"))
    app.register_blueprint(search_router, url_prefix='/music/search')
    app.register_blueprint(batch_bp, url_prefix='/music')


    @app.cli.command("seed")
    def seed_command():
            seed_all(db.session)
            print("Database seeded successfully.")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5002)
