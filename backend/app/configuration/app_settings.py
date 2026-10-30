from functools import lru_cache
from pathlib import Path

from pydantic import Field, HttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIRECTORY / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    aws_region: str = Field(min_length=1)
    dynamodb_table_name: str = Field(min_length=1)
    public_base_url: HttpUrl
    cors_origins: list[str] = []

    @field_validator("public_base_url")
    @classmethod
    def validate_public_base_url(cls, value: HttpUrl) -> HttpUrl:
        if value.query or value.fragment or value.username or value.password:
            raise ValueError(
                "PUBLIC_BASE_URL no debe incluir credenciales, consulta ni fragmento."
            )
        return value


@lru_cache
def get_settings() -> AppSettings:
    return AppSettings()
