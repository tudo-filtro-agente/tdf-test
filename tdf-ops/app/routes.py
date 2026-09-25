"""Routes — endpoints que o tdf-portal consome."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import get_db
from . import models, config

router = APIRouter(prefix="/api", tags=["ops"])

@router.get("/health")
def health():
    return {"status": "ok", "service": "tdf-ops", "env": config.ENVIRONMENT, "dry_run": config.DRY_RUN}

@router.get("/clientes")
def list_clientes(db: Session = Depends(get_db)):
    """Lista clientes. No banco de teste vem vazio."""
    rows = db.query(models.Cliente).order_by(models.Cliente.id.desc()).limit(100).all()
    return [
        {"id": r.id, "omie_id": r.omie_id, "nome": r.nome,
         "telefone": r.telefone, "cidade": r.cidade, "empresa": r.empresa}
        for r in rows
    ]

@router.post("/clientes")
def create_cliente(payload: dict, db: Session = Depends(get_db)):
    """Cria cliente. No modo DRY_RUN só loga, não persiste."""
    if config.DRY_RUN:
        print(f"[DRY_RUN] create_cliente: {payload}")
        return {"id": 99999, "dry_run": True, "echo": payload}
    obj = models.Cliente(
        omie_id=payload.get("omie_id"),
        nome=payload.get("nome", ""),
        telefone=payload.get("telefone"),
        cidade=payload.get("cidade"),
        empresa=payload.get("empresa"),
    )
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id, "dry_run": False}

@router.get("/pedidos")
def list_pedidos(db: Session = Depends(get_db)):
    rows = db.query(models.Pedido).order_by(models.Pedido.id.desc()).limit(100).all()
    return [
        {"id": r.id, "omie_id": r.omie_id, "cliente_id": r.cliente_id,
         "valor_total": r.valor_total, "status": r.status, "empresa": r.empresa}
        for r in rows
    ]

@router.post("/pedidos")
def create_pedido(payload: dict, db: Session = Depends(get_db)):
    if config.DRY_RUN:
        print(f"[DRY_RUN] create_pedido: {payload}")
        return {"id": 99999, "dry_run": True, "echo": payload}
    obj = models.Pedido(
        omie_id=payload.get("omie_id"),
        cliente_id=payload.get("cliente_id"),
        valor_total=payload.get("valor_total", 0.0),
        status=payload.get("status", "pendente"),
        empresa=payload.get("empresa"),
    )
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id, "dry_run": False}

@router.get("/kanban")
def list_kanban(db: Session = Depends(get_db)):
    rows = db.query(models.KanbanCard).order_by(models.KanbanCard.coluna, models.KanbanCard.posicao).all()
    return [
        {"id": r.id, "titulo": r.titulo, "coluna": r.coluna,
         "pedido_id": r.pedido_id, "posicao": r.posicao}
        for r in rows
    ]

@router.post("/kanban")
def create_kanban_card(payload: dict, db: Session = Depends(get_db)):
    if config.DRY_RUN:
        print(f"[DRY_RUN] create_kanban_card: {payload}")
        return {"id": 99999, "dry_run": True, "echo": payload}
    obj = models.KanbanCard(
        titulo=payload.get("titulo", "Sem título"),
        coluna=payload.get("coluna", "todo"),
        pedido_id=payload.get("pedido_id"),
        posicao=payload.get("posicao", 0),
    )
    db.add(obj); db.commit(); db.refresh(obj)
    return {"id": obj.id, "dry_run": False}

@router.get("/rotas")
def list_rotas(db: Session = Depends(get_db)):
    rows = db.query(models.Rota).order_by(models.Rota.id.desc()).limit(50).all()
    return [
        {"id": r.id, "data": r.data, "motorista": r.motorista,
         "cliente_ids": r.cliente_ids, "status": r.status}
        for r in rows
    ]
