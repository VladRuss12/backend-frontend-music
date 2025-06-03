from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from uuid import UUID
from app.services.batch_service import BatchUserService

batch_user_bp = Blueprint("batch_users", __name__, url_prefix="/music")

@batch_user_bp.route('/users/batch', methods=['POST'])
def batch_users():
    try:
        data = request.get_json()
        if not data or 'ids' not in data:
            return jsonify({"error": "Missing 'ids' in request body."}), 400
        ids = [UUID(str(i)) for i in data['ids']]
        dumped = BatchUserService.get_users_by_ids(ids)
        return jsonify(dumped), 200
    except (ValueError, ValidationError) as e:
        return jsonify({"error": f"Invalid UUID or data: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500