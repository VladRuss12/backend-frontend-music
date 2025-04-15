from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# URL-адреса микросервисов (можно через ENV или docker-compose)
USER_SERVICE_URL = "http://localhost:5001"
AUTH_SERVICE_URL = "http://localhost:5002"


@app.route("/users/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy_user_service(path):
    url = f"{USER_SERVICE_URL}/users/{path}"
    resp = requests.request(
        method=request.method,
        url=url,
        headers={key: value for key, value in request.headers if key != 'Host'},
        json=request.get_json(silent=True),
        params=request.args
    )
    return jsonify(resp.json()), resp.status_code


@app.route("/auth/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy_auth_service(path):
    url = f"{AUTH_SERVICE_URL}/auth/{path}"
    resp = requests.request(
        method=request.method,
        url=url,
        headers={key: value for key, value in request.headers if key != 'Host'},
        json=request.get_json(silent=True),
        params=request.args
    )
    return jsonify(resp.json()), resp.status_code


if __name__ == "__main__":
    app.run(port=8088)
