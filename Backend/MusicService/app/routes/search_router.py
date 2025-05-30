from flask import Blueprint, request, jsonify
from app.services.search_service import SearchService

search_router = Blueprint('search', __name__)


@search_router.route('/', methods=['GET'])
def search():
    query = request.args.get('query', '')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    search_service = SearchService(query)
    results = search_service.search()

    return jsonify(results)


@search_router.route('/playlists', methods=['GET'])
def search_playlists_route():
    query = request.args.get('query', '')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    search_service = SearchService(query)
    playlists = search_service.search_playlists()

    return jsonify(playlists)


@search_router.route('/tracks', methods=['GET'])
def search_tracks_route():
    query = request.args.get('query', '')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    search_service = SearchService(query)
    tracks = search_service.search_tracks()

    return jsonify(tracks)


@search_router.route('/performers', methods=['GET'])
def search_performers_route():
    query = request.args.get('query', '')

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    search_service = SearchService(query)
    performers = search_service.search_performers()

    return jsonify(performers)
