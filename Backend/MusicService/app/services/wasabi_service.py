import boto3
import uuid
import tempfile
import ffmpeg
import importlib.util
from werkzeug.datastructures import FileStorage


def load_wasabi_config(path: str = "config/wasabi_config.py"):
    spec = importlib.util.spec_from_file_location("wasabi_config", path)
    wasabi_config = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(wasabi_config)
    return wasabi_config


def get_track_duration(file: FileStorage) -> int:
    """Определение длительности трека в секундах через ffmpeg"""
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        try:
            probe = ffmpeg.probe(tmp.name)
            duration = float(probe['format']['duration'])
            return int(duration)
        except Exception as e:
            print(f"FFmpeg failed: {e}")  # Можно заменить на логгер
            return 0


def upload_track_to_wasabi(file: FileStorage, filename: str = None, config_path: str = "config/wasabi_config.py") -> str:
    """Загрузка трека в Wasabi S3 и возврат URL"""
    cfg = load_wasabi_config(config_path)

    s3 = boto3.client(
        's3',
        endpoint_url=cfg.WASABI_ENDPOINT_URL,
        aws_access_key_id=cfg.WASABI_ACCESS_KEY,
        aws_secret_access_key=cfg.WASABI_SECRET_KEY
    )

    bucket = cfg.WASABI_BUCKET_NAME
    filename = filename or f"{uuid.uuid4()}_{file.filename}"

    try:
        s3.upload_fileobj(
            Fileobj=file,
            Bucket=bucket,
            Key=filename,
            ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
        )
        return f"{cfg.WASABI_ENDPOINT_URL}/{bucket}/{filename}"
    except Exception as e:
        print(f"Upload to Wasabi failed: {e}")  # Можно заменить на логгер
        raise
