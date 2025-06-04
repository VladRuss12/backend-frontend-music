from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from uuid import UUID
from app.services.batch_service import BatchService
from app.services.track_service import TrackService
from app.services.playlist_service import PlaylistService
from app.services.performer_service import PerformerService

batch_bp = Blueprint("batch", __name__, url_prefix="/music")

def _handle_batch(service):
    try:
        data = request.get_json()
        if not data or 'ids' not in data:
            return jsonify({"error": "Missing 'ids' in request body."}), 400
        ids = [UUID(str(i)) for i in data['ids']]
        dumped = BatchService.get_by_ids(service, ids)
        return jsonify(dumped), 200
    except (ValueError, ValidationError) as e:
        return jsonify({"error": f"Invalid UUID or data: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@batch_bp.route('/tracks/batch', methods=['POST'])
def batch_tracks():
    return _handle_batch(TrackService)

@batch_bp.route('/playlists/batch', methods=['POST'])
def batch_playlists():
    return _handle_batch(PlaylistService)

@batch_bp.route('/performers/batch', methods=['POST'])
def batch_performers():
    return _handle_batch(PerformerService)