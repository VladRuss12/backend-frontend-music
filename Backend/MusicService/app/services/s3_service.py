import boto3
import uuid
from dotenv import load_dotenv
import os

load_dotenv()

s3 = boto3.client(
    's3',
    endpoint_url=os.getenv("S3_ENDPOINT_URL"),  # для Wasabi или другого S3-совместимого сервиса
    aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
    region_name=os.getenv("S3_REGION")
)

class S3Service:
    @staticmethod
    def upload_track(file_obj, filename: str, content_type: str) -> str:
        """
        Загружает файл в S3 и возвращает URL для доступа к файлу.
        """
        unique_filename = f"{uuid.uuid4()}_{filename}"
        bucket = os.getenv("S3_BUCKET")

        s3.upload_fileobj(
            file_obj,
            bucket,
            unique_filename,
            ExtraArgs={"ContentType": content_type}
        )

        url = f"{os.getenv('S3_PUBLIC_URL')}/{unique_filename}"
        return url

    @staticmethod
    def generate_presigned_url(bucket: str, unique_filename: str, expiration: int = 3600) -> str:
        """
        Генерирует временную ссылку для скачивания файла.
        """
        try:
            url = s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': bucket, 'Key': unique_filename},
                ExpiresIn=expiration  # Время жизни ссылки (по умолчанию 1 час)
            )
            return url
        except Exception as e:
            print(f"Ошибка при создании временной ссылки: {e}")
            return None