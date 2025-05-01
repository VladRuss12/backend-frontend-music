from flask import Flask
from app.routes.listening_routes import listening_bp
from app.routes.recommendation_routes import recommendation_bp

app = Flask(__name__)

app.register_blueprint(listening_bp)
app.register_blueprint(recommendation_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5003)
