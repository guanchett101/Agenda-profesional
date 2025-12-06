# 📋 AGENDA IGARA - Configuración Completa

## 🎯 Información General

**Nombre**: AGENDA IGARA online  
**URL Producción**: https://agenda-igara.onrender.com  
**Repositorio**: https://github.com/guanchett101/Agenda-profesional  
**Plataforma**: Render (Plan Free)  

---

## 🏗️ Arquitectura

### Servidor Unificado
- **Backend (FastAPI)** + **Frontend (React + Vite)** en un solo servicio
- Backend montado en `/api/*`
- Frontend servido en la raíz `/`

### Tecnologías
- **Backend**: Python 3.12, FastAPI, SQLAlchemy, Uvicorn
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Base de Datos**: SQLite (archivo local `agenda.db`)

---

## ⚙️ Configuración de Render

### Tipo de Servicio
- **Web Service** (NO Static Site)

### Configuración de Build
```bash
# Build Command
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..

# Start Command
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Variables de Entorno
- **NINGUNA** - No se necesitan variables de entorno
- El frontend detecta automáticamente si está en local o producción

### Configuración Automática
- **Auto-Deploy**: ✅ Activado (cada push a `main` despliega automáticamente)
- **Branch**: `main`
- **Root Directory**: `.` (raíz del proyecto)

---

## 📁 Estructura del Proyecto

```
agenda-profesional/
├── backend.py              # API FastAPI con todas las rutas
├── server.py               # Servidor unificado (backend + frontend)
├── agenda.db               # Base de datos SQLite
├── requirements.txt        # Dependencias Python
├── Procfile               # Comando de inicio para Render
├── runtime.txt            # Versión de Python
├── migrate_db.py          # Script de migración de BD
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Componente principal React
│   │   └── index.css      # Estilos globales
│   ├── package.json       # Dependencias Node.js
│   ├── vite.config.ts     # Configuración Vite
│   └── dist/              # Build del frontend (generado)
└── .gitignore
```

---

## 🔧 Archivos Clave

### 1. `server.py` - Servidor Unificado
```python
# Monta el backend en /api
app.mount("/api", backend_app)

# Sirve el frontend estático
app.mount("/assets", StaticFiles(directory="./frontend/dist/assets"))

# Redirige todas las rutas al index.html (SPA routing)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Sirve archivos estáticos o index.html
```

### 2. `frontend/src/App.tsx` - Detección de Entorno
```typescript
// Detecta automáticamente si está en local o producción
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? `http://${window.location.hostname}:8000`
    : `${window.location.origin}/api`);
```

### 3. `backend.py` - Migración Automática
```python
# Migración automática al iniciar
def migrate_database():
    # Agrega columna 'recordatorio' si no existe
    cursor.execute("ALTER TABLE tareas ADD COLUMN recordatorio INTEGER DEFAULT 0")

@app.on_event("startup")
def startup_event():
    migrate_database()  # Ejecuta migración
```

---

## 🗄️ Base de Datos

### Modelo de Datos (Tabla `tareas`)
```sql
CREATE TABLE tareas (
    id INTEGER PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descripcion TEXT,
    fecha VARCHAR NOT NULL,
    hora VARCHAR,
    completada BOOLEAN DEFAULT 0,
    prioridad VARCHAR DEFAULT 'media',
    recordatorio INTEGER DEFAULT 0,
    creada_en DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Campos
- **id**: ID único autoincremental
- **titulo**: Título de la tarea (requerido)
- **descripcion**: Descripción opcional
- **fecha**: Fecha en formato YYYY-MM-DD (requerido)
- **hora**: Hora en formato HH:MM (opcional)
- **completada**: Boolean (true/false)
- **prioridad**: 'baja', 'media', 'alta'
- **recordatorio**: Minutos antes (0, 15, 30, 60)
- **creada_en**: Timestamp de creación

---

## 🚀 API Endpoints

### Base URL
- **Local**: `http://localhost:8000`
- **Producción**: `https://agenda-igara.onrender.com/api`

### Rutas Disponibles

#### 1. Obtener todas las tareas
```http
GET /api/tareas
```
**Respuesta**: Array de tareas ordenadas por fecha y hora

#### 2. Obtener una tarea específica
```http
GET /api/tareas/{id}
```

#### 3. Crear nueva tarea
```http
POST /api/tareas
Content-Type: application/json

{
  "titulo": "Reunión",
  "descripcion": "Reunión con cliente",
  "fecha": "2024-12-10",
  "hora": "10:00",
  "prioridad": "alta",
  "recordatorio": 15
}
```

#### 4. Actualizar tarea
```http
PUT /api/tareas/{id}
Content-Type: application/json

{
  "titulo": "Reunión actualizada",
  "descripcion": "Nueva descripción",
  "fecha": "2024-12-10",
  "hora": "11:00",
  "completada": false,
  "prioridad": "media",
  "recordatorio": 30
}
```

#### 5. Eliminar tarea
```http
DELETE /api/tareas/{id}
```

#### 6. Marcar como completada/pendiente
```http
PATCH /api/tareas/{id}/completar
```

---

## 🎨 Características del Frontend

### Vista Principal: Calendario
- Calendario mensual completo
- Navegación entre meses (◀ ▶)
- Días con tareas marcados en **rojo** con fondo rojo claro
- **Número discreto** en esquina inferior derecha indica cantidad de tareas
- Día actual resaltado en azul
- Día seleccionado con gradiente azul
- Semana comienza en **lunes**

### Panel Lateral: Tareas del Día
- Muestra tareas del día seleccionado
- Ordenadas por hora
- Checkbox para marcar como completada
- Badges de prioridad con colores:
  - 🔴 Alta: Rojo
  - 🟡 Media: Ámbar
  - 🟢 Baja: Verde
- Botones de editar y eliminar
- Scroll automático si hay muchas tareas

### Modal de Crear/Editar
- Formulario completo con validación
- Campos:
  - Título (requerido)
  - Descripción (opcional)
  - Fecha (requerido)
  - Hora (opcional)
  - Prioridad (baja/media/alta)
  - Recordatorio (0, 15, 30, 60 minutos)
- Header con gradiente azul
- Diseño responsive

### Responsive Design
- **Desktop**: Calendario (2/3) + Panel lateral (1/3)
- **Tablet**: Calendario arriba, panel abajo
- **Móvil**: 
  - Calendario compacto
  - Días de semana abreviados (L, M, X...)
  - Panel de tareas debajo
  - Botones táctiles optimizados (44px mínimo)
  - Font-size 16px en inputs (evita zoom en iOS)

---

## 🔄 Flujo de Despliegue

### Desarrollo Local
```bash
# Terminal 1: Backend
cd agenda-profesional
source venv/bin/activate
uvicorn backend:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd agenda-profesional/frontend
npm run dev
```

### Despliegue Automático
1. Hacer cambios en el código
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   ```
3. Render detecta el cambio automáticamente
4. Ejecuta el build (5-10 minutos):
   - Instala dependencias Python
   - Instala dependencias Node.js
   - Compila el frontend
   - Inicia el servidor
5. Despliega la nueva versión

---

## 🐛 Solución de Problemas

### Error: "NetworkError when attempting to fetch"
**Causa**: Variable de entorno `VITE_API_URL` configurada incorrectamente  
**Solución**: Eliminar la variable en Render → Environment

### Error: "JSON.parse: unexpected end of data"
**Causa**: Backend no responde o devuelve HTML en lugar de JSON  
**Solución**: Verificar que el servidor esté usando `server.py` y no `backend.py`

### Error: "column recordatorio does not exist"
**Causa**: Base de datos no tiene la columna recordatorio  
**Solución**: La migración automática se ejecuta al iniciar. Verificar logs.

### Frontend muestra página en blanco
**Causa**: Error en el build del frontend  
**Solución**: Revisar logs de build en Render, verificar que `npm run build` se ejecutó correctamente

### Backend se duerme (Plan Free)
**Causa**: Render duerme servicios gratuitos después de 15 minutos sin uso  
**Solución**: Primera petición tarda 30-60 segundos en despertar. Es normal.

---

## 📊 Monitoreo y Logs

### Ver Logs en Render
1. Dashboard → agenda-igara
2. Pestaña "Logs"
3. Filtrar por tipo:
   - Build logs
   - Deploy logs
   - Runtime logs

### Logs Importantes
```
✅ Build successful
✅ Application startup complete
✅ Migración completada
✅ Uvicorn running on http://0.0.0.0:10000
```

---

## 🔐 Seguridad

### CORS
- Configurado para aceptar todas las origins (`*`)
- Apropiado para aplicación pública
- Permite credentials

### HTTPS
- Render proporciona HTTPS automáticamente
- Certificado SSL incluido
- Redirección automática HTTP → HTTPS

### Base de Datos
- SQLite local (no expuesta)
- Sin credenciales necesarias
- Backup automático en el repositorio

---

## 📈 Rendimiento

### Plan Free de Render
- **CPU**: Compartida
- **RAM**: 512 MB
- **Almacenamiento**: Efímero (se reinicia en cada deploy)
- **Ancho de banda**: 100 GB/mes
- **Tiempo de inactividad**: Se duerme después de 15 min sin uso

### Optimizaciones
- Frontend compilado y minificado
- Assets servidos como archivos estáticos
- Base de datos SQLite (rápida para pocos usuarios)
- Caché de navegador habilitado

---

## 🔄 Actualizaciones Futuras

### Mejoras Sugeridas
- [ ] Autenticación de usuarios
- [ ] Base de datos PostgreSQL (persistente)
- [ ] Notificaciones push para recordatorios
- [ ] Exportar tareas a PDF/Excel
- [ ] Categorías/etiquetas para tareas
- [ ] Vista de lista además del calendario
- [ ] Búsqueda y filtros avanzados
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Sincronización con Google Calendar

---

## 📞 Soporte y Recursos

### Documentación
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Render**: https://render.com/docs
- **TailwindCSS**: https://tailwindcss.com

### Comandos Útiles

```bash
# Desarrollo local
./arrancar.sh

# Migrar base de datos manualmente
python migrate_db.py

# Compilar frontend
cd frontend && npm run build

# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ver estructura de la base de datos
sqlite3 agenda.db "PRAGMA table_info(tareas);"

# Ver todas las tareas
sqlite3 agenda.db "SELECT * FROM tareas;"
```

---

## 📝 Notas Finales

### Backup
- El código está en GitHub (backup automático)
- La base de datos se reinicia en cada deploy
- Para datos persistentes, considerar PostgreSQL

### Costos
- **Actual**: $0/mes (Plan Free)
- **Upgrade a Starter**: $7/mes (sin sleep, más recursos)

### Limitaciones del Plan Free
- ⚠️ Se duerme después de 15 min sin uso
- ⚠️ 750 horas/mes de uptime
- ⚠️ Base de datos efímera (se borra en redeploy)

---

## ✅ Checklist de Configuración

- [x] Repositorio en GitHub
- [x] Servicio Web en Render
- [x] Build command configurado
- [x] Start command configurado
- [x] Variables de entorno eliminadas
- [x] Auto-deploy activado
- [x] Dominio público generado
- [x] HTTPS habilitado
- [x] Migración automática de BD
- [x] Frontend compilado correctamente
- [x] API funcionando en /api
- [x] Calendario responsive
- [x] CRUD de tareas completo
- [x] Recordatorios implementados

---

## 🎉 ¡Todo Listo!

Tu **AGENDA IGARA online** está completamente configurada y funcionando en:

**https://agenda-igara.onrender.com**

Disfruta de tu agenda profesional con:
- ✅ Calendario visual intuitivo
- ✅ Gestión completa de tareas
- ✅ Recordatorios configurables
- ✅ Diseño responsive
- ✅ Disponible 24/7 en Internet

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Autor**: Configurado por Kiro AI Assistant
