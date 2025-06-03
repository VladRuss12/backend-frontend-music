from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from uuid import UUID
from app.services.batch_service import BatchService

batch_bp = Blueprint("batch", __name__, url_prefix="/music")

@batch_bp.route('/tracks/batch', methods=['POST'])
def batch_tracks():
    try:
        data = request.get_json()
        if not data or 'ids' not in data:
            return jsonify({"error": "Missing 'ids' in request body."}), 400
        ids = [UUID(str(i)) for i in data['ids']]
        dumped = BatchService.get_tracks_by_ids(ids)
        return jsonify(dumped), 200
    except (ValueError, ValidationError) as e:
        return jsonify({"error": f"Invalid UUID or data: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@batch_bp.route('/playlists/batch', methods=['POST'])
def batch_playlists():
    try:
        data = request.get_json()
        if not data or 'ids' not in data:
            return jsonify({"error": "Missing 'ids' in request body."}), 400
        ids = [UUID(str(i)) for i in data['ids']]
        dumped = BatchService.get_playlists_by_ids(ids)
        return jsonify(dumped), 200
    except (ValueError, ValidationError) as e:
        return jsonify({"error": f"Invalid UUID or data: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500