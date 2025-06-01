import io
from flask import Response, send_file
from app.database.database import db
from app.models.stream_file_model import StreamFileModel

class StreamService:
    model = StreamFileModel

    @classmethod
    def save_file(cls, file, track_id):
        if file.filename == '':
            raise ValueError("No selected file")
        file_data = file.read()
        file_record = cls.model(
            track_id=track_id,
            filename=file.filename,
            data=file_data,
            mimetype=file.mimetype or "audio/mpeg"
        )
        db.session.add(file_record)
        db.session.commit()
        return file_record.id

    @classmethod
    def get_file_by_id(cls, file_id):
        return db.session.query(cls.model).filter_by(id=file_id).first()

    @classmethod
    def stream_file_response(cls, file_id, range_header):
        file_record = cls.get_file_by_id(file_id)
        if not file_record or not file_record.data:
            print(f"[ERROR] file not found for id={file_id}")
            raise FileNotFoundError

        file_size = len(file_record.data)
        print(f"[DEBUG] Found file {file_id} with size {file_size} and mimetype {file_record.mimetype}")

        if range_header:
            print(f"[DEBUG] Range requested: {range_header}")
            try:
                byte1, byte2 = 0, None
                m = range_header.replace('bytes=', '').split('-')
                if m[0]:
                    byte1 = int(m[0])
                if len(m) > 1 and m[1]:
                    byte2 = int(m[1])
                else:
                    byte2 = file_size - 1
                length = byte2 - byte1 + 1

                def generate_stream():
                    yield file_record.data[byte1:byte2 + 1]

                resp = Response(
                    generate_stream(),
                    status=206,
                    mimetype=file_record.mimetype,
                    direct_passthrough=True,
                )
                resp.headers.add('Content-Range', f'bytes {byte1}-{byte2}/{file_size}')
                resp.headers.add('Accept-Ranges', 'bytes')
                resp.headers.add('Content-Length', str(length))
                print(
                    f"[DEBUG] Returning 206 with Content-Range: bytes {byte1}-{byte2}/{file_size}, Content-Length: {length}")
                return resp
            except Exception as e:
                print(f"[ERROR] Exception in range handling: {e}")
                raise
        else:
            print("[DEBUG] No range requested, using send_file")
            return send_file(
                io.BytesIO(file_record.data),
                mimetype=file_record.mimetype,
                as_attachment=False,
                download_name=file_record.filename
            )