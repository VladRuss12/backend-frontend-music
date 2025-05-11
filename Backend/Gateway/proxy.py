import requests
from flask import request, jsonify
from config import SERVICE_MAP

def proxy_request(service_url):
    """Проксирование запроса к целевому сервису"""
    # Определяем целевой путь (удаляем префикс gateway)
    path = request.path
    for prefix in SERVICE_MAP:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break

    url = f"{service_url}{path}"

    # Подготавливаем заголовки
    headers = {k: v for k, v in request.headers if k.lower() != 'host'}
    if hasattr(request, 'current_user'):
        headers['X-User-ID'] = request.current_user

    # Выполняем запрос
    resp = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=request.get_data(),
        params=request.args,
        cookies=request.cookies
    )

    # Формируем ответ
    try:
        return jsonify(resp.json()), resp.status_code
    except:
        return resp.content, resp.status_code
