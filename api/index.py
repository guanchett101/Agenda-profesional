from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Agregar el directorio raíz al path para importar backend
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend import app

# Configurar CORS para Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handler para Vercel
handler = Mangum(app)
