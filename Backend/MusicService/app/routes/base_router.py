from flask import Blueprint, request, jsonify
from werkzeug.exceptions import NotFound, BadRequest

def create_crud_routes(service, url_prefix: str, name: str = None):
    bp_name = name or url_prefix.strip('/').replace('/', '_') or 'default_blueprint'
    bp = Blueprint(bp_name, __name__, url_prefix=f"/{url_prefix}")

    @bp.get('/')
    def get_all():
        try:
            items = service.get_all()
            return jsonify(items)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.get('/ids')
    def get_all_ids():
        try:
            ids = service.get_all_ids()
            return jsonify({"ids": ids})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.get('/<item_id>')
    def get_by_id(item_id):
        try:
            item = service.get_by_id(item_id)
            if not item:
                raise NotFound(f"{service.model.__name__} with ID {item_id} not found.")
            return jsonify(item)
        except NotFound as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.post('/')
    def create():
        try:
            data = request.json
            if not data:
                raise BadRequest("Missing data in request body.")
            new_id = service.create(data)
            return jsonify({'id': new_id}), 201
        except BadRequest as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.put('/<item_id>')
    def update(item_id):
        try:
            data = request.json
            if not data:
                raise BadRequest("Missing data in request body.")
            updated = service.update(item_id, data)
            if not updated:
                raise BadRequest(f"Update failed for {service.model.__name__} with ID {item_id}.")
            return jsonify({'updated': True})
        except BadRequest as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @bp.delete('/<item_id>')
    def delete(item_id):
        try:
            deleted = service.delete(item_id)
            if not deleted:
                raise BadRequest(f"Deletion failed for {service.model.__name__} with ID {item_id}.")
            return jsonify({'deleted': True})
        except BadRequest as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return bp
