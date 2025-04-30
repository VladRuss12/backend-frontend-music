import requests
from flask import Blueprint, request, jsonify, send_file
from werkzeug.exceptions import BadRequest, NotFound
from io import BytesIO

from app.services.track_service import TrackService
from app.services.wasabi_service import upload_track_to_wasabi, get_track_duration

track_upload_bp = Blueprint('track_upload', __name__, url_prefix='/tracks')


@track_upload_bp.post('/upload')
def upload_track():
    try:
        file = request.files.get('file')
        if not file:
            raise BadRequest("No file provided")

        # Обязательные поля
        required_fields = ['title', 'performer_id']
        form_data = request.form.to_dict()

        for field in required_fields:
            if not form_data.get(field):
                raise BadRequest(f"Missing required field: {field}")

        # Определение длительности
        duration = get_track_duration(file)
        file.stream.seek(0)  # Вернуть указатель на начало

        # Загрузка на Wasabi
        file_url = upload_track_to_wasabi(file)

        # Подготовка данных трека
        form_data['file_url'] = file_url
        form_data['duration'] = duration

        # Сохранение в БД
        new_id = TrackService.create(form_data)
        return jsonify({'id': new_id}), 201

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@track_upload_bp.get('/download/<track_id>')
def download_track(track_id):
    try:
        track = TrackService.get_by_id(track_id)
        if not track:
            raise NotFound("Track not found")

        file_url = track.get('file_url') or getattr(track, 'file_url', None)
        title = track.get('title') or getattr(track, 'title', 'track')

        if not file_url:
            raise BadRequest("No file URL available for this track")

        response = requests.get(file_url, stream=True)
        response.raise_for_status()

        return send_file(
            BytesIO(response.content),
            download_name=f"{title}.mp3",
            as_attachment=True,
            mimetype='audio/mpeg'
        )

    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except requests.RequestException as e:
        return jsonify({"error": f"Failed to download track: {e}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500
