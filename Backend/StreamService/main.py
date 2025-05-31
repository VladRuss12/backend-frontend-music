from flask import Flask
from flask_migrate import Migrate

from app.database.database import init_db, db
from app.routes.stream_routes import stream_bp
from app.database.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    migrate = Migrate(app, db)
    init_db(app)
    app.register_blueprint(stream_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5006)