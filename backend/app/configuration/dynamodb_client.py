import boto3
from botocore.config import Config

from app.configuration.app_settings import get_settings


def get_dynamodb_table():
    settings = get_settings()

    # Cada operación usa su propia sesión y recurso: no se comparten entre hilos.
    # En EC2, Boto3 obtiene las credenciales temporales del rol IAM.
    session = boto3.Session(region_name=settings.aws_region)
    dynamodb = session.resource(
        "dynamodb",
        config=Config(
            connect_timeout=3,
            read_timeout=5,
            retries={"mode": "standard", "total_max_attempts": 3},
        ),
    )
    return dynamodb.Table(settings.dynamodb_table_name)
