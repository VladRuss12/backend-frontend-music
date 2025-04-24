from flask import Blueprint, request, jsonify

def create_crud_routes(service, url_prefix: str, name: str = None):
    # Используем url_prefix как имя, если не передано имя для blueprint
    bp_name = name or url_prefix.strip('/').replace('/', '_') or 'default_blueprint'
    bp = Blueprint(bp_name, __name__, url_prefix=f"/{url_prefix}")

    @bp.get('/')
    def get_all():
        try:
            items = service.get_all()
            return jsonify([item.dict() for item in items])
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.get('/<item_id>')
    def get_by_id(item_id):
        try:
            item = service.get_by_id(item_id)
            if not item:
                return jsonify({'error': 'Not found'}), 404
            return jsonify(item.dict())
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.post('/')
    def create():
        try:
            data = request.json
            if not data:
                return jsonify({"error": "Missing data"}), 400
            new_id = service.create(data)
            return jsonify({'id': new_id}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.put('/<item_id>')
    def update(item_id):
        try:
            data = request.json
            if not data:
                return jsonify({"error": "Missing data"}), 400
            updated = service.update(item_id, data)
            if not updated:
                return jsonify({"error": "Update failed"}), 400
            return jsonify({'updated': True})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.delete('/<item_id>')
    def delete(item_id):
        try:
            deleted = service.delete(item_id)
            if not deleted:
                return jsonify({"error": "Deletion failed"}), 400
            return jsonify({'deleted': True})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return bp
