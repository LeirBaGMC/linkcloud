from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from botocore.exceptions import BotoCoreError, ClientError

from app.configuration.app_settings import get_settings
from app.routers.url_router import router

settings = get_settings()

app = FastAPI(
    title="LinkCloud API",
    description="Creación, consulta y redirección de enlaces.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(BotoCoreError)
@app.exception_handler(ClientError)
async def handle_dynamodb_error(
    request: Request, error: BotoCoreError | ClientError
) -> JSONResponse:
    # Los detalles internos de AWS no se exponen al navegador.
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "No se pudo acceder al almacenamiento de enlaces."},
    )


app.include_router(router)
