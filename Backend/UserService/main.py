from flask import Flask

from flask_jwt_extended import JWTManager
from app.database.config import Config
from app.database.database import init_db, db
from app.routes.user_routes import bp as users_bp
from app.routes.auth_routes import auth_bp
from app.seeder.user_seeder import seed_users
from flask.cli import with_appcontext
from app.utils.config import get_settings

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    settings = get_settings()
    app.config["JWT_SECRET_KEY"] = settings.JWT_SECRET_KEY
    app.config["JWT_ALGORITHM"] = settings.JWT_ALGORITHM
    app.config["JWT_TOKEN_LOCATION"] = settings.JWT_TOKEN_LOCATION

    JWTManager(app)

    init_db(app)
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(batch_user_bp, url_prefix='/users')
    app.register_blueprint(auth_bp)
    return app

app = create_app()

@app.cli.command("seed")
@with_appcontext
def seed():
    seed_users(db.session)
    print("Сидер выполнен успешно!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
