from flask import Flask
from flask_cors import CORS
from auth import jwt_required
from proxy import proxy_request
from config import get_settings, SERVICE_MAP

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True,
    allow_headers=["*"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

settings = get_settings()

@app.route('/users', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/users/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required
def users_proxy(path):
    return proxy_request(SERVICE_MAP['/users'])

@app.route('/music', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/music/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required
def music_proxy(path):
    return proxy_request(SERVICE_MAP['/music'])

@app.route('/recommendations', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/recommendations/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required
def recommendations_proxy(path):
    return proxy_request(SERVICE_MAP['/recommendations'])

@app.route('/chat', methods=['POST'])
@jwt_required
def chat_proxy():
    return proxy_request(SERVICE_MAP['/chat'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
