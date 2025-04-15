# app/main.py
from flask import Flask
from app.config import Config
from app.routes.user_routes import bp as users_bp
from app.routes.auth_routes import auth_bp
from app.database import init_db
from app.seeder.user_seeder import seed_users  # Импортируем сидер

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Загружаем конфигурацию из Config
    init_db(app)  # Инициализируем PyMongo
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(auth_bp)
    seed_users()
    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5001)