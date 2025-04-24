import os

from flask import Blueprint, request, jsonify
from app.services.track_service import TrackService
from app.services.s3_service import S3Service
from app.routes.base_router import create_crud_routes  # Импортируем генератор CRUD

track_bp = Blueprint("tracks", __name__, url_prefix="/tracks")

# ────────────────
# Специфичный маршрут для загрузки трека
# ────────────────
@track_bp.route("/upload", methods=["POST"])
def upload_track():
    file = request.files.get("file")
    title = request.form.get("title")
    artist_id = request.form.get("artist_id")

    if not file or not title or not artist_id:
        return jsonify({"error": "Missing fields"}), 400

    file_url = S3Service.upload_track(file, file.filename, file.content_type)

    track = {
        "title": title,
        "artist_id": artist_id,
        "duration": 180,  # Можно вытягивать из метаданных позже
        "file_url": file_url
    }

    created = TrackService.create(track)
    return jsonify(created.dict()), 201

# ────────────────
# Специфичный маршрут для скачивания трека через временную ссылку
# ────────────────
@track_bp.route("/<track_id>/download", methods=["GET"])
def download_track(track_id):
    track = TrackService.get_by_id(track_id)
    if not track:
        return jsonify({'error': 'Track not found'}), 404

    file_url = S3Service.generate_presigned_url(os.getenv("S3_BUCKET"), track.file_url)

    if not file_url:
        return jsonify({'error': 'Could not generate download URL'}), 500

    return jsonify({'download_url': file_url})


# Генерация CRUD маршрутов
crud_bp = create_crud_routes(TrackService, url_prefix="")

# Регистрируем маршруты из crud_bp в track_bp
for endpoint, view_func in crud_bp.view_functions.items():
    # Получаем маршрут, ассоциированный с endpoint
    rule = crud_bp.url_map._rules_by_endpoint.get(endpoint)[0]

    # Переименовываем endpoint для уникальности
    new_endpoint = f"tracks.{endpoint}"

    # Добавляем маршрут в track_bp
    track_bp.add_url_rule(rule.rule, endpoint=new_endpoint, view_func=view_func, methods=rule.methods)