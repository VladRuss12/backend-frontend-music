from flask import Blueprint, request, jsonify, abort
from app.services.stream_service import StreamService
from app.schemas.stream_file_schema import StreamFileSchema

stream_bp = Blueprint("stream_bp", __name__, url_prefix="/stream")

@stream_bp.route('/upload', methods=['POST'])
def stream_file_upload():
    file = request.files.get('file')
    track_id = request.form.get('track_id')
    if not file or not track_id:
        return jsonify({"error": "file and track_id are required"}), 400
    try:
        file_id = StreamService.save_file(file, track_id)
        return jsonify({"file_id": str(file_id)}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@stream_bp.route('/<file_id>', methods=['GET'])
def stream_file(file_id):
    try:
        resp = StreamService.stream_file_response(file_id, request.headers.get('Range'))
        return resp
    except FileNotFoundError:
        abort(404)

@stream_bp.route('/<file_id>/meta', methods=['GET'])
def stream_file_meta(file_id):
    file_record = StreamService.get_file_by_id(file_id)
    if not file_record:
        abort(404)
    schema = StreamFileSchema()
    return jsonify(schema.dump(file_record))