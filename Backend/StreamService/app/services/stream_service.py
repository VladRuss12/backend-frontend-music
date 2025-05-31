from app.database.database import db
from app.models.stream_file_model import StreamFileModel


class StreamService:
    model = StreamFileModel

    @classmethod
    def get_file_by_id(cls, file_id):
        return db.session.query(cls.model).filter_by(id=file_id).first()