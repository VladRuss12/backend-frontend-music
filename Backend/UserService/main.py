from flask import Flask

from app.database.config import Config
from app.database.database import init_db, db
from app.routes.user_routes import bp as users_bp
from app.routes.auth_routes import auth_bp
from app.seeder.user_seeder import seed_users
from flask.cli import with_appcontext

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    init_db(app)
    app.register_blueprint(users_bp, url_prefix="/users")
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
