"""Config do tdf-ops — carrega variáveis de ambiente."""
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "")
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "test")
DRY_RUN = os.environ.get("DRY_RUN", "true").lower() == "true"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
