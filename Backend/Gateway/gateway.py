from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

USER_SERVICE_URL = "http://user-service:5001"
MUSIC_SERVICE_URL = "http://music-service:5003"
RECOMMENDATION_SERVICE_URL = "http://recommendation-service:5004"
CHAT_SERVICE_URL = "http://chat-service:5004"

def proxy_request(service_url, prefix, path):
    url = f"{service_url}/{prefix}/{path}"
    resp = requests.request(
        method=request.method,
        url=url,
        headers={key: value for key, value in request.headers if key.lower() != 'host'},
        json=request.get_json(silent=True),
        params=request.args
    )
    try:
        return jsonify(resp.json()), resp.status_code
    except Exception:
        return resp.text, resp.status_code


@app.route("/users/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy_user_service(path):
    return proxy_request(USER_SERVICE_URL, "users", path)


@app.route("/music/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy_music_service(path):
    return proxy_request(MUSIC_SERVICE_URL, "", path)

@app.route("/recommendations/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def proxy_recommendation_service(path):
    return proxy_request(RECOMMENDATION_SERVICE_URL, "", path)

@app.route("/chat", methods=["POST"])
def proxy_chat_service():
    url = f"{CHAT_SERVICE_URL}/chat"
    resp = requests.post(
        url=url,
        headers={key: value for key, value in request.headers if key.lower() != 'host'},
        json=request.get_json(silent=True),
    )
    return jsonify(resp.json()), resp.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
