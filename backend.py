# Backend - Agenda Profesional con Base de Datos
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuración de la base de datos
import os

# Railway proporciona DATABASE_URL automáticamente
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agenda.db")

# Ajustar para PostgreSQL o SQLite
if DATABASE_URL.startswith("postgresql"):
    # Railway usa postgresql://, SQLAlchemy necesita postgresql://
    engine = create_engine(DATABASE_URL.replace("postgresql://", "postgresql://", 1))
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de base de datos
class TareaDB(Base):
    __tablename__ = "tareas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    fecha = Column(String, nullable=False)
    hora = Column(String)
    completada = Column(Boolean, default=False)
    prioridad = Column(String, default="media")  # baja, media, alta
    recordatorio = Column(Integer, default=0)  # minutos antes (0=sin recordatorio, 15, 30, 60)
    creada_en = Column(DateTime, default=datetime.now)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Modelo Pydantic
class Tarea(BaseModel):
    id: Optional[int] = None
    titulo: str
    descripcion: Optional[str] = ""
    fecha: str
    hora: Optional[str] = ""
    completada: bool = False
    prioridad: str = "media"
    recordatorio: int = 0

# Crear la aplicación
app = FastAPI(title="Agenda Profesional API")

# Configurar CORS para red local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== RUTAS ====================

@app.get("/")
def inicio():
    db_type = "PostgreSQL (persistente)" if DATABASE_URL.startswith("postgresql") else "SQLite (local)"
    return {
        "mensaje": "API de Agenda IGARA funcionando",
        "base_de_datos": db_type,
        "plataforma": "Railway" if DATABASE_URL.startswith("postgresql") else "Local"
    }

@app.get("/tareas", response_model=List[Tarea])
def obtener_tareas():
    """Obtener todas las tareas"""
    db = SessionLocal()
    tareas = db.query(TareaDB).order_by(TareaDB.fecha, TareaDB.hora).all()
    db.close()
    return tareas

@app.get("/tareas/{tarea_id}", response_model=Tarea)
def obtener_tarea(tarea_id: int):
    """Obtener una tarea específica"""
    db = SessionLocal()
    tarea = db.query(TareaDB).filter(TareaDB.id == tarea_id).first()
    db.close()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea

@app.post("/tareas", response_model=Tarea)
def crear_tarea(tarea: Tarea):
    """Crear una nueva tarea"""
    db = SessionLocal()
    db_tarea = TareaDB(
        titulo=tarea.titulo,
        descripcion=tarea.descripcion,
        fecha=tarea.fecha,
        hora=tarea.hora,
        completada=tarea.completada,
        prioridad=tarea.prioridad,
        recordatorio=tarea.recordatorio
    )
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    db.close()
    return db_tarea

@app.put("/tareas/{tarea_id}", response_model=Tarea)
def actualizar_tarea(tarea_id: int, tarea: Tarea):
    """Actualizar una tarea existente"""
    db = SessionLocal()
    db_tarea = db.query(TareaDB).filter(TareaDB.id == tarea_id).first()
    if not db_tarea:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    db_tarea.titulo = tarea.titulo
    db_tarea.descripcion = tarea.descripcion
    db_tarea.fecha = tarea.fecha
    db_tarea.hora = tarea.hora
    db_tarea.completada = tarea.completada
    db_tarea.prioridad = tarea.prioridad
    db_tarea.recordatorio = tarea.recordatorio
    
    db.commit()
    db.refresh(db_tarea)
    db.close()
    return db_tarea

@app.delete("/tareas/{tarea_id}")
def eliminar_tarea(tarea_id: int):
    """Eliminar una tarea"""
    db = SessionLocal()
    tarea = db.query(TareaDB).filter(TareaDB.id == tarea_id).first()
    if not tarea:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    db.delete(tarea)
    db.commit()
    db.close()
    return {"mensaje": "Tarea eliminada correctamente"}

@app.patch("/tareas/{tarea_id}/completar")
def marcar_completada(tarea_id: int):
    """Marcar tarea como completada/pendiente"""
    db = SessionLocal()
    tarea = db.query(TareaDB).filter(TareaDB.id == tarea_id).first()
    if not tarea:
        db.close()
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    tarea.completada = not tarea.completada
    db.commit()
    db.refresh(tarea)
    db.close()
    return tarea

# Servir archivos estáticos del frontend (solo en producción)
if os.path.exists("./frontend/dist"):
    app.mount("/assets", StaticFiles(directory="./frontend/dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Servir el frontend en producción"""
        if full_path.startswith("tareas"):
            # Si es una ruta de API, dejar que FastAPI la maneje
            raise HTTPException(status_code=404)
        
        file_path = f"./frontend/dist/{full_path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse("./frontend/dist/index.html")

# Migración automática de base de datos
def migrate_database():
    """Agrega la columna recordatorio si no existe (solo SQLite)"""
    if not DATABASE_URL.startswith("postgresql"):
        import sqlite3
        conn = sqlite3.connect('./agenda.db')
        cursor = conn.cursor()
        try:
            cursor.execute("PRAGMA table_info(tareas)")
            columns = [column[1] for column in cursor.fetchall()]
            
            if 'recordatorio' not in columns:
                print("🔄 Migrando base de datos SQLite...")
                cursor.execute("ALTER TABLE tareas ADD COLUMN recordatorio INTEGER DEFAULT 0")
                conn.commit()
                print("✅ Migración SQLite completada")
        except Exception as e:
            print(f"⚠️  Error en migración: {e}")
            conn.rollback()
        finally:
            conn.close()
    else:
        print("✅ Usando PostgreSQL en Railway")

# Datos de ejemplo al iniciar
@app.on_event("startup")
def startup_event():
    # Ejecutar migración
    migrate_database()
    
    db = SessionLocal()
    if db.query(TareaDB).count() == 0:
        tareas_ejemplo = [
            TareaDB(
                titulo="Reunión de equipo",
                descripcion="Revisar avances del proyecto",
                fecha="2025-12-01",
                hora="10:00",
                prioridad="alta",
                recordatorio=0
            ),
            TareaDB(
                titulo="Enviar informe mensual",
                descripcion="Preparar y enviar el informe de noviembre",
                fecha="2025-12-01",
                hora="15:00",
                prioridad="media",
                recordatorio=0
            ),
            TareaDB(
                titulo="Llamar al cliente",
                descripcion="Seguimiento del proyecto X",
                fecha="2025-12-02",
                hora="09:00",
                prioridad="alta",
                recordatorio=0
            )
        ]
        db.add_all(tareas_ejemplo)
        db.commit()
    db.close()
