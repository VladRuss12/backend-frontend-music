from marshmallow import Schema
from flask import current_app
from typing import Type, TypeVar, Optional

from app.database.database import db

T = TypeVar('T')  # SQLAlchemy модель
S = TypeVar('S', bound=Schema)  # Marshmallow схема

class BaseService:
    model: Type[T]
    schema: Type[S]

    @classmethod
    def get_all(cls):
        try:
            db_session = db.session
            results = db_session.query(cls.model).all()
            return cls.schema(many=True).dump(results)
        except Exception as e:
            current_app.logger.exception(f"Error in get_all for {cls.model.__name__}: {str(e)}")
            raise e

    @classmethod
    def get_all_ids(cls):
        try:
            db_session = db.session
            ids = [str(obj.id) for obj in db_session.query(cls.model.id).all()]
            return ids
        except Exception as e:
            current_app.logger.exception(f"Error in get_all_ids for {cls.model.__name__}: {str(e)}")
            raise e

    @classmethod
    def get_by_id(cls, object_id):
        try:
            db_session = db.session
            result = db_session.query(cls.model).filter(cls.model.id == object_id).first()
            if result:
                return cls.schema().dump(result)
            return None
        except Exception as e:
            current_app.logger.error(f"Error in get_by_id for {object_id}: {str(e)}")
            raise e

    @classmethod
    def create(cls, data: dict):
        try:
            db_session = db.session
            model_instance = cls.model(**data)
            db_session.add(model_instance)
            db_session.commit()
            db_session.refresh(model_instance)
            return cls.schema().dump(model_instance)
        except Exception as e:
            current_app.logger.error(f"Error in create: {str(e)}")
            raise e

    @classmethod
    def update(cls, object_id, data: dict) -> Optional[dict]:
        try:
            db_session = db.session
            obj = db_session.query(cls.model).filter(cls.model.id == object_id).first()
            if obj:
                for key, value in data.items():
                    setattr(obj, key, value)
                db_session.commit()
                return cls.schema().dump(obj)
            return None
        except Exception as e:
            current_app.logger.error(f"Error in update for {object_id}: {str(e)}")
            raise e

    @classmethod
    def delete(cls, object_id) -> bool:
        try:
            db_session = db.session
            obj = db_session.query(cls.model).filter(cls.model.id == object_id).first()
            if obj:
                db_session.delete(obj)
                db_session.commit()
                return True
            return False
        except Exception as e:
            current_app.logger.error(f"Error in delete for {object_id}: {str(e)}")
            raise e
