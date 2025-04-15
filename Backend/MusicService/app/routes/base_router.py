from flask import Blueprint, request, jsonify

def create_crud_routes(service, url_prefix: str, name: str = None):
    bp_name = name or url_prefix.strip('/').replace('/', '_')
    bp = Blueprint(bp_name, __name__, url_prefix=f"/{url_prefix}")

    @bp.get('/')
    def get_all():
        items = service.get_all()
        return jsonify([item.dict() for item in items])

    @bp.get('/<item_id>')
    def get_by_id(item_id):
        item = service.get_by_id(item_id)
        if not item:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(item.dict())

    @bp.post('/')
    def create():
        data = request.json
        new_id = service.create(data)
        return jsonify({'id': new_id}), 201

    @bp.put('/<item_id>')
    def update(item_id):
        data = request.json
        updated = service.update(item_id, data)
        return jsonify({'updated': bool(updated)})

    @bp.delete('/<item_id>')
    def delete(item_id):
        deleted = service.delete(item_id)
        return jsonify({'deleted': bool(deleted)})

    return bp
