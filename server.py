"""
Servidor que sirve tanto el backend API como el frontend estático
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from backend import app as backend_app

# Montar el backend en /api
app = FastAPI()
app.mount("/api", backend_app)

# Verificar si existe el directorio del frontend compilado
frontend_path = "./frontend/dist"
if os.path.exists(frontend_path):
    # Servir archivos estáticos del frontend
    app.mount("/assets", StaticFiles(directory=f"{frontend_path}/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Sirve el frontend para todas las rutas no API"""
        file_path = os.path.join(frontend_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Si no existe el archivo, devuelve index.html (para SPA routing)
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "mensaje": "Frontend no compilado. Ejecuta: cd frontend && npm run build",
            "api": "El API está disponible en /api"
        }
