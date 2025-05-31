from flask import Flask
from flask_migrate import Migrate
from flask.cli import with_appcontext

from app.database.database import init_db, db
from app.routes.stream_routes import stream_bp
from app.database.config import Config
from app.seeders.seeder import generate_all_seeds

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    init_db(app)
    Migrate(app, db)
    app.register_blueprint(stream_bp)
    return app

app = create_app()

@app.cli.command("seed")
@with_appcontext
def seed():
    generate_all_seeds(db.session)
    print("Все сидеры выполнены успешно!")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5006)