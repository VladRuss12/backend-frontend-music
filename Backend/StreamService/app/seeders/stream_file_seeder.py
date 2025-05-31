import os
from uuid import UUID
from app.models.stream_file_model import StreamFileModel
from app.external_clients.music_client import get_all_tracks

SEED_FILE_PATH = os.path.join(os.path.dirname(__file__), "seed_file.mp3")

def generate_stream_file_seed(session):
    tracks = get_all_tracks()
    if not tracks:
        print("Нет треков для сидирования StreamFile!")
        return

    if not os.path.isfile(SEED_FILE_PATH):
        print(f"Нет seed mp3 файла по пути {SEED_FILE_PATH}!")
        return

    with open(SEED_FILE_PATH, "rb") as f:
        data = f.read()
    filename = os.path.basename(SEED_FILE_PATH)

    added = 0
    for track in tracks:
        file_record = StreamFileModel(
            track_id=UUID(track["id"]),
            filename=filename,
            data=data,
            mimetype="audio/mpeg"
        )
        session.add(file_record)
        added += 1

    session.commit()
    print(f"StreamFile сидировано: {added} файлов (по одному на каждый трек)")

