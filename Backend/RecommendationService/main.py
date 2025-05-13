from flask import Flask
from flask.cli import with_appcontext
from flask_migrate import Migrate

from app.routes.listening_routes import listening_bp
from app.routes.recommendation_routes import recommendation_bp
from app.database.config import Config
from app.database.database import db, init_db
from app.seeders.seeder import generate_all_seeds

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    init_db(app)

    app.register_blueprint(listening_bp)
    app.register_blueprint(recommendation_bp)

    return app


app = create_app()

@app.cli.command("seed")
@with_appcontext
def seed():
    session = db.session  # Получаем сессию SQLAlchemy
    generate_all_seeds(session)  # Запуск сидеров
    print("Все сидеры выполнены успешно!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)