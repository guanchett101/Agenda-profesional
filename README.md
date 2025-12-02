# 📅 Agenda Profesional

Sistema de gestión de tareas con calendario, diseñado para funcionar en red local (LAN).

## ✨ Características

✅ **Calendario interactivo** - Vista mensual con navegación
✅ **Crear tareas** - Con título, descripción, fecha, hora y prioridad
✅ **Editar tareas** - Modificar cualquier tarea existente
✅ **Eliminar tareas** - Borrar tareas completadas o no deseadas
✅ **Marcar como completada** - Checkbox para tareas finalizadas
✅ **Prioridades** - Alta (rojo), Media (amarillo), Baja (verde)
✅ **Vista de lista** - Ver todas las tareas en formato lista
✅ **Base de datos persistente** - Los datos se guardan en SQLite
✅ **Acceso en red local** - Múltiples PCs pueden acceder simultáneamente
✅ **Diseño minimalista** - Interfaz limpia y profesional

---

## 🚀 Inicio Rápido

### Linux

```bash
./arrancar.sh
```

### Windows

Doble clic en `arrancar.bat`

---

## 📦 Primera instalación

### Linux:

```bash
# 1. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# 2. Instalar dependencias Python
pip install fastapi uvicorn pydantic sqlalchemy

# 3. Instalar dependencias Node.js
cd frontend
npm install
cd ..

# 4. Arrancar
./arrancar.sh
```

### Windows:

```powershell
# 1. Crear entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Instalar dependencias Python
pip install fastapi uvicorn pydantic sqlalchemy

# 3. Instalar dependencias Node.js
cd frontend
npm install
cd ..

# 4. Arrancar
Doble clic en arrancar.bat
```

---

## 🌐 Acceso en red local

### 1. Ver tu IP

**Linux:**
```bash
hostname -I
```

**Windows:**
```powershell
ipconfig
```

### 2. Acceder desde otras PCs

En las otras PCs, abrir navegador:
```
http://TU_IP:5173
```

Ejemplo: `http://192.168.1.221:5173`

---

## 📂 Estructura del proyecto

```
agenda-profesional/
├── backend.py              # API FastAPI
├── agenda.db               # Base de datos SQLite
├── venv/                   # Entorno virtual Python
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── App.tsx        # Componente principal
│   │   ├── main.tsx       # Punto de entrada
│   │   └── index.css      # Estilos Tailwind
│   └── package.json       # Dependencias Node.js
├── arrancar.sh            # Script de inicio Linux
├── arrancar.bat           # Script de inicio Windows
└── README.md              # Este archivo
```

---

## 🎯 Uso de la aplicación

### Crear una tarea

1. Click en **"+ Nueva Tarea"**
2. Llenar el formulario:
   - Título (obligatorio)
   - Descripción (opcional)
   - Fecha (obligatorio)
   - Hora (opcional)
   - Prioridad (baja/media/alta)
3. Click en **"Crear"**

### Editar una tarea

1. Click en el icono ✏️ de la tarea
2. Modificar los campos
3. Click en **"Guardar"**

### Eliminar una tarea

1. Click en el icono 🗑️ de la tarea
2. Confirmar la eliminación

### Marcar como completada

- Click en el checkbox de la tarea
- Las tareas completadas se muestran tachadas y con menor opacidad

### Navegar por el calendario

- **←** y **→** para cambiar de mes
- **Hoy** para volver al día actual
- Click en cualquier día para ver sus tareas

### Cambiar de vista

- **Calendario**: Vista mensual con tareas del día seleccionado
- **Lista**: Todas las tareas en formato lista

---

## 💾 Base de datos

Los datos se guardan en `agenda.db` (SQLite).

**Backup:**

**Linux:**
```bash
cp agenda.db backup_$(date +%Y%m%d).db
```

**Windows:**
```powershell
copy agenda.db backup.db
```

---

## 🔧 Configuración avanzada

### Cambiar puertos

**Backend (puerto 8000):**
Editar `arrancar.sh` o `arrancar.bat` y cambiar `--port 8000`

**Frontend (puerto 5173):**
Editar `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Cambiar aquí
  }
})
```

### Firewall

Si las otras PCs no pueden conectarse:

**Linux:**
```bash
sudo ufw allow 8000
sudo ufw allow 5173
```

**Windows:**
- Panel de Control → Firewall → Permitir puertos 8000 y 5173

---

## 🛑 Detener el sistema

- **Linux:** Presiona `Ctrl + C` en cada terminal
- **Windows:** Cierra las ventanas de CMD

---

## 📱 Acceso desde móviles

También funciona desde teléfonos y tablets:

1. Conectar el móvil a la misma WiFi
2. Abrir navegador
3. Ir a: `http://TU_IP:5173`

---

## ⚠️ Solución de problemas

### "Puerto en uso"

**Linux:**
```bash
sudo lsof -i :8000
sudo kill -9 PID
```

**Windows:**
```powershell
netstat -ano | findstr :8000
taskkill /PID NUMERO /F
```

### "No se puede conectar desde otras PCs"

- Verifica que estén en la misma red
- Revisa el firewall
- Usa `ping TU_IP` para verificar conectividad

### "Error al cargar tareas"

- Verifica que el backend esté corriendo
- Abre `http://localhost:8000/docs` para ver la API

---

## 🎨 Personalización

### Colores de prioridad

Editar en `frontend/src/App.tsx`:

```typescript
const colorPrioridad = (prioridad: string) => {
  switch (prioridad) {
    case 'alta': return 'bg-red-100 border-red-500 text-red-700';
    case 'media': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    case 'baja': return 'bg-green-100 border-green-500 text-green-700';
  }
};
```

---

## 🚀 Características futuras (ideas)

- [ ] Notificaciones de tareas próximas
- [ ] Categorías/etiquetas para tareas
- [ ] Filtros por prioridad/estado
- [ ] Exportar tareas a PDF
- [ ] Recordatorios por email
- [ ] Vista semanal
- [ ] Tareas recurrentes
- [ ] Colaboración en tiempo real

---

## 📞 Puertos utilizados

- **8000** - Backend API
- **5173** - Frontend Web

---

## 🎉 ¡Listo para usar!

El sistema está completamente configurado y listo para funcionar en red local.

**Características principales:**
- ✅ Calendario visual
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Diseño minimalista y profesional
- ✅ Funciona en LAN
- ✅ Base de datos persistente
- ✅ Compatible con Windows, Linux y Mac
