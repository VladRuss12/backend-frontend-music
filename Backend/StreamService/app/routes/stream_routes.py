import os
from flask import Blueprint, request, abort, Response, send_file, jsonify

from app.services.stream_service import StreamService
from app.schemas.stream_file_schema import StreamFileSchema

stream_bp = Blueprint("stream_bp", __name__, url_prefix="/stream")

def generate_stream(file_path, start, end):
    with open(file_path, 'rb') as f:
        f.seek(start)
        remaining = end - start + 1
        chunk_size = 4096
        while remaining > 0:
            chunk = f.read(min(chunk_size, remaining))
            if not chunk:
                break
            yield chunk
            remaining -= len(chunk)

@stream_bp.route('/<file_id>')
def stream_file(file_id):
    file_record = StreamService.get_file_by_id(file_id)
    if not file_record or not os.path.isfile(file_record.path):
        abort(404)
    file_size = os.path.getsize(file_record.path)
    range_header = request.headers.get('Range', None)
    if range_header:
        byte1, byte2 = 0, None
        m = range_header.replace('bytes=', '').split('-')
        if m[0]:
            byte1 = int(m[0])
        if len(m) > 1 and m[1]:
            byte2 = int(m[1])
        else:
            byte2 = file_size - 1
        length = byte2 - byte1 + 1

        resp = Response(
            generate_stream(file_record.path, byte1, byte2),
            status=206,
            mimetype=file_record.mimetype,
            direct_passthrough=True,
        )
        resp.headers.add('Content-Range', f'bytes {byte1}-{byte2}/{file_size}')
        resp.headers.add('Accept-Ranges', 'bytes')
        resp.headers.add('Content-Length', str(length))
        return resp
    else:
        return send_file(file_record.path, mimetype=file_record.mimetype)

@stream_bp.route('/<file_id>/meta')
def stream_file_meta(file_id):
    file_record = StreamService.get_file_by_id(file_id)
    if not file_record:
        abort(404)
    schema = StreamFileSchema()
    return jsonify(schema.dump(file_record))