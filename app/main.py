"""Entry point — tdf-ops."""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routes import router as ops_router
from .auth import require_internal_key

# Cria tabelas no startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="tdf-ops", version="0.1.0-test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health público (Railway usa pra healthcheck)
@app.get("/health")
def health():
    from . import config
    return {"status": "ok", "service": "tdf-ops", "env": config.ENVIRONMENT}

# Rotas protegidas
app.include_router(ops_router, dependencies=[Depends(require_internal_key)])
