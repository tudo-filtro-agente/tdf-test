"""Modelos — tabelas vazias no banco."""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text
from sqlalchemy.sql import func
from .db import Base

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True)
    omie_id = Column(String, unique=True, index=True)
    nome = Column(String, nullable=False)
    telefone = Column(String, index=True)
    cidade = Column(String)
    empresa = Column(String)  # 'Mococa', 'Tudo de Filtro', 'American'
    created_at = Column(DateTime, server_default=func.now())

class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True)
    omie_id = Column(String, unique=True, index=True)
    cliente_id = Column(Integer, index=True)
    valor_total = Column(Float, default=0.0)
    status = Column(String, default="pendente")
    empresa = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class KanbanCard(Base):
    __tablename__ = "kanban_cards"
    id = Column(Integer, primary_key=True)
    titulo = Column(String, nullable=False)
    coluna = Column(String, default="todo")  # todo | doing | done
    pedido_id = Column(Integer, index=True, nullable=True)
    posicao = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

class Rota(Base):
    __tablename__ = "rotas"
    id = Column(Integer, primary_key=True)
    data = Column(String, index=True)  # YYYY-MM-DD
    motorista = Column(String)
    cliente_ids = Column(Text)  # JSON array como string
    status = Column(String, default="planejada")
    created_at = Column(DateTime, server_default=func.now())
