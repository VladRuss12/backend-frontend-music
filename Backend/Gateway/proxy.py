import requests
from flask import request, jsonify, g
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

    # Явно добавляем Authorization, если есть
    if 'Authorization' in request.headers:
        headers['Authorization'] = request.headers['Authorization']

    # Добавляем X-User-ID, если установлен в g
    if getattr(g, "current_user_id", None):
        headers["X-User-ID"] = g.current_user_id

    # Проксируем запрос
    resp = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=request.get_data(),
        params=request.args,
        cookies=request.cookies
    )

    # Пытаемся вернуть JSON, иначе — как есть
    try:
        return jsonify(resp.json()), resp.status_code
    except ValueError:
        return resp.content, resp.status_code

