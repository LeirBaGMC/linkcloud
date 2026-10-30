from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import RedirectResponse

from app.schemas.url_schemas import UrlCreate, UrlCreated, UrlRead
from app.services.url_service import create_short_url, get_url

router = APIRouter(tags=["Enlaces"])


def get_url_or_404(short_code: UUID) -> UrlRead:
    record = get_url(short_code)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El enlace no existe.",
        )
    return record


@router.post(
    "/shorten",
    response_model=UrlCreated,
    status_code=status.HTTP_201_CREATED,
)
def shorten_url(data: UrlCreate) -> UrlCreated:
    return create_short_url(data)


@router.get("/urls/{short_code}", response_model=UrlRead)
def read_url(short_code: UUID) -> UrlRead:
    return get_url_or_404(short_code)


# La ruta dinámica se registra después de las rutas específicas.
@router.get(
    "/{short_code}",
    response_class=RedirectResponse,
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
)
def redirect_url(short_code: UUID) -> RedirectResponse:
    record = get_url_or_404(short_code)
    return RedirectResponse(
        url=str(record.original_url),
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )
