import requests
from flask import request, Response, g

from config import SERVICE_MAP

def proxy_request(service_url):
    path = request.path
    prefix = None
    for p in SERVICE_MAP:
        if path.startswith(p):
            prefix = p
            break

    url = f"{service_url}{path}"

    headers = {k: v for k, v in request.headers.items() if k.lower() != 'host'}

    if 'Authorization' in request.headers:
        headers['Authorization'] = request.headers['Authorization']

    if getattr(g, "current_user_id", None):
        headers["X-User-ID"] = g.current_user_id

    resp = requests.request(
        method=request.method,
        url=url,
        headers=headers,
        data=request.get_data(),
        params=request.args,
        cookies=request.cookies,
        stream=True
    )


    excluded_headers = ['content-encoding', 'transfer-encoding', 'connection']
    headers = [
        (name, value)
        for name, value in resp.raw.headers.items()
        if name.lower() not in excluded_headers
    ]

    response = Response(resp.raw, resp.status_code, headers)
    return response