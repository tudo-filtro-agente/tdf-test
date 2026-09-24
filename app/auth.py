"""Auth — valida INTERNAL_API_KEY em todas as rotas /api/*."""
from fastapi import Header, HTTPException
from . import config

async def require_internal_key(x_internal_key: str = Header(None)):
    if not x_internal_key:
        raise HTTPException(status_code=401, detail="X-Internal-Key header missing")
    if x_internal_key != config.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid internal key")
    return x_internal_key
