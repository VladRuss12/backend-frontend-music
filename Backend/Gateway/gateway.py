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

# --- Public Auth ---
@app.route('/auth/register', methods=['POST'])
@app.route('/auth/login', methods=['POST'])
@app.route('/auth/refresh', methods=['POST'])
def public_auth_proxy():
    return proxy_request(SERVICE_MAP['/users'])

# --- User Service ---
@app.route('/users', defaults={'path': ''}, methods=['GET', 'POST'])
@app.route('/users/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required(inject_user_id=False)
def users_proxy(path=''):
    return proxy_request(SERVICE_MAP['/users'])

# --- Music Service ---
@app.route('/music', defaults={'path': ''}, methods=['GET'])
@app.route('/music/<path:path>', methods=['GET'])
def public_music_proxy(path=''):
    return proxy_request(SERVICE_MAP['/music'])

@app.route('/music', defaults={'path': ''}, methods=['POST', 'PUT', 'DELETE'])
@app.route('/music/<path:path>', methods=['POST', 'PUT', 'DELETE'])
@jwt_required(inject_user_id=False)
def protected_music_proxy(path=''):
    return proxy_request(SERVICE_MAP['/music'])

# --- Recommendations ---
@app.route('/recommendations', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/recommendations/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
def recommendations_proxy(path=''):
    return proxy_request(SERVICE_MAP['/recommendations'])

# --- Chat ---
@app.route('/chat', methods=['POST'])
@jwt_required(inject_user_id=False)
def chat_proxy():
    return proxy_request(SERVICE_MAP['/chat'])

# --- Stream ---
@app.route('/stream', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/stream/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def stream_proxy(path=''):
    return proxy_request(SERVICE_MAP['/stream'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)