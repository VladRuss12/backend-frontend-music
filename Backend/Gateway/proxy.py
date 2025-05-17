import requests
from flask import request, jsonify
from config import SERVICE_MAP

def proxy_request(service_url):
    path = request.path
    prefix = None
    for p in SERVICE_MAP:
        if path.startswith(p):
            prefix = p
            break

    url = f"{service_url}{path}"

    # Подготовка заголовков
    headers = {}
    for k, v in request.headers.items():
        if k.lower() != 'host':
            headers[k] = v

    # Явно добавим Authorization обратно
    if 'Authorization' in request.headers:
        headers['Authorization'] = request.headers['Authorization']

    if hasattr(request, 'current_user'):
        headers['X-User-ID'] = request.current_user

    resp = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=request.get_data(),
        params=request.args,
        cookies=request.cookies
    )

    try:
        return jsonify(resp.json()), resp.status_code
    except:
        return resp.content, resp.status_code

