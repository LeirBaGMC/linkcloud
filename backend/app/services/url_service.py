from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.configuration.app_settings import get_settings
from app.repositories.url_repository import find_url, save_url
from app.schemas.url_schemas import UrlCreate, UrlCreated, UrlRead


def create_short_url(data: UrlCreate) -> UrlCreated:
    settings = get_settings()
    record = UrlRead(
        short_code=uuid4(),
        original_url=data.original_url,
        created_at=datetime.now(timezone.utc),
    )

    # DynamoDB recibe UUID, URL y fecha como cadenas de texto.
    save_url(record.model_dump(mode="json"))

    base_url = str(settings.public_base_url).rstrip("/")
    return UrlCreated(
        **record.model_dump(),
        short_url=f"{base_url}/{record.short_code}",
    )


def get_url(short_code: UUID) -> UrlRead | None:
    item = find_url(str(short_code))
    if item is None:
        return None
    return UrlRead.model_validate(item)
