from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl


class UrlCreate(BaseModel):
    original_url: HttpUrl


class UrlRead(BaseModel):
    short_code: UUID
    original_url: HttpUrl
    created_at: datetime


class UrlCreated(UrlRead):
    short_url: HttpUrl
