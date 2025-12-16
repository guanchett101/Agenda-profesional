# 🚀 Guía Completa: Migración a Supabase

## ¿Por qué Supabase?

✅ **100% GRATIS** sin tarjeta de crédito (a diferencia de Firebase)
✅ **PostgreSQL real** con persistencia garantizada
✅ **500 MB** de base de datos gratis
✅ **No se duerme** - siempre activo
✅ **API REST automática** - sin backend Python
✅ **Panel de administración** para ver/editar datos
✅ **Más fácil** que Firebase

---

## Paso 1: Crear Cuenta en Supabase

1. Ve a: **https://supabase.com**
2. Haz clic en **"Start your project"**
3. Inicia sesión con:
   - GitHub (recomendado)
   - Google
   - Email

---

## Paso 2: Crear Proyecto

1. Haz clic en **"New project"**
2. Completa:
   - **Name**: `agenda-igara`
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Elige la más cercana:
     - España: `West EU (Ireland)`
     - Latinoamérica: `South America (São Paulo)`
     - USA: `East US (North Virginia)`
   - **Pricing Plan**: **FREE** (ya seleccionado)
3. Haz clic en **"Create new project"**
4. **Espera 2-3 minutos** mientras se crea el proyecto

---

## Paso 3: Crear Tabla en la Base de Datos

1. En el menú lateral, ve a **"Table Editor"**
2. Haz clic en **"Create a new table"**
3. Configura:
   - **Name**: `tareas`
   - **Description**: `Tabla de tareas de la agenda`
   - **Enable Row Level Security (RLS)**: **DESACTIVADO** (quita el check)

4. **Columnas** (haz clic en "Add column" para cada una):

   | Nombre | Tipo | Default | Opciones |
   |--------|------|---------|----------|
   | `id` | `int8` | Auto | Primary, Auto-increment |
   | `titulo` | `text` | - | - |
   | `descripcion` | `text` | `''` | - |
   | `fecha` | `text` | - | - |
   | `hora` | `text` | `''` | - |
   | `completada` | `bool` | `false` | - |
   | `prioridad` | `text` | `'media'` | - |
   | `recordatorio` | `int4` | `0` | - |
   | `created_at` | `timestamptz` | `now()` | - |

5. Haz clic en **"Save"**

### Alternativa Rápida: SQL Editor

Si prefieres copiar/pegar, ve a **"SQL Editor"** y ejecuta:

```sql
CREATE TABLE tareas (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  fecha TEXT NOT NULL,
  hora TEXT DEFAULT '',
  completada BOOLEAN DEFAULT false,
  prioridad TEXT DEFAULT 'media',
  recordatorio INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Desactivar RLS para acceso público
ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;
```

---

## Paso 4: Obtener Credenciales

1. Ve a **"Settings"** (⚙️ en el menú lateral)
2. Haz clic en **"API"**
3. **COPIA** estos dos valores:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (es largo)

---

## Paso 5: Instalar Supabase en tu Proyecto

```bash
cd agenda-profesional/frontend

# Instalar Supabase
npm install @supabase/supabase-js
```

---

## Paso 6: Configurar Credenciales

1. Abre el archivo: `frontend/src/supabase.ts`
2. **Reemplaza** con tus credenciales:

```typescript
const supabaseUrl = 'https://xxxxxxxxxxxxx.supabase.co'; // Tu Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Tu anon public key
```

---

## Paso 7: Cambiar a la Versión Supabase

1. Abre: `frontend/src/main.tsx`
2. Cambia la importación:

```typescript
// ANTES:
import App from './App.tsx'

// DESPUÉS:
import App from './AppSupabase.tsx'
```

---

## Paso 8: Probar Localmente

```bash
cd agenda-profesional/frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre: **http://localhost:5173**

### ✅ Verifica que funcione:
- Crea una tarea
- Edita una tarea
- Elimina una tarea
- **Recarga la página** - las tareas deben seguir ahí
- Ve a Supabase → Table Editor → tareas (verás los datos)

---

## Paso 9: Desplegar en Vercel (Gratis)

Supabase solo es la base de datos. Para el frontend, usa **Vercel**:

### Opción A: Desde GitHub

1. Sube tu código a GitHub:
```bash
cd agenda-profesional
git add .
git commit -m "Migración a Supabase"
git push
```

2. Ve a: **https://vercel.com**
3. Inicia sesión con GitHub
4. Haz clic en **"Add New Project"**
5. Selecciona tu repositorio `agenda-profesional`
6. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
7. Haz clic en **"Deploy"**

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Ir a la carpeta frontend
cd agenda-profesional/frontend

# Compilar
npm run build

# Desplegar
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? agenda-igara
# - In which directory? ./ (presiona Enter)
# - Override settings? No

# Desplegar a producción
vercel --prod
```

---

## Paso 10: ¡Listo! 🎉

Tu agenda estará en:
```
https://agenda-igara.vercel.app
```

O el dominio que te asigne Vercel.

---

## Ventajas de Supabase + Vercel

| Característica | Supabase + Vercel | Render | Firebase |
|---------------|-------------------|--------|----------|
| **Costo** | ✅ Gratis sin tarjeta | ⚠️ Requiere tarjeta | ❌ Requiere tarjeta |
| **Persistencia** | ✅ PostgreSQL real | ❌ SQLite efímero | ✅ Firestore |
| **Sleep mode** | ✅ Nunca se duerme | ❌ Se duerme | ✅ Nunca |
| **Backend** | ✅ API automática | ❌ Python manual | ✅ SDK |
| **Panel admin** | ✅ Incluido | ❌ No | ⚠️ Limitado |
| **Velocidad** | ✅ Muy rápido | ⚠️ Lento | ✅ Rápido |

---

## Límites del Plan Gratuito

### Supabase (FREE):
- **500 MB** de base de datos
- **1 GB** de transferencia/mes
- **50,000** usuarios activos/mes
- **2 proyectos** simultáneos
- **Más que suficiente** para uso personal

### Vercel (FREE):
- **100 GB** de ancho de banda/mes
- **100** despliegues/día
- **Dominios personalizados** ilimitados
- **SSL automático**

---

## Ver y Editar Datos

### Desde Supabase Dashboard:
1. Ve a **Table Editor**
2. Selecciona tabla `tareas`
3. Puedes:
   - Ver todas las tareas
   - Editar directamente
   - Eliminar registros
   - Exportar a CSV

### Desde SQL:
1. Ve a **SQL Editor**
2. Ejecuta consultas:

```sql
-- Ver todas las tareas
SELECT * FROM tareas ORDER BY fecha, hora;

-- Tareas pendientes
SELECT * FROM tareas WHERE completada = false;

-- Tareas de hoy
SELECT * FROM tareas WHERE fecha = '2025-12-16';

-- Eliminar todas las tareas
DELETE FROM tareas;
```

---

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente el `anon public` key (no el `service_role`)
- Asegúrate de que no haya espacios extra

### Error: "relation tareas does not exist"
- La tabla no se creó correctamente
- Ve a Table Editor y verifica que existe `tareas`
- O ejecuta el SQL del Paso 3

### Error: "Row Level Security"
- Ve a Table Editor → tareas → Settings
- Desactiva "Enable Row Level Security"
- O ejecuta: `ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;`

### Las tareas no se guardan
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica que las credenciales sean correctas

### Error: "Failed to fetch"
- Verifica tu conexión a internet
- Comprueba que el proyecto Supabase esté activo (no pausado)

---

## Migrar Datos Existentes

Si tienes tareas en Render que quieres conservar:

1. **Exportar desde Render** (crea endpoint temporal):
```python
# Agregar a backend.py
@app.get("/export")
def exportar():
    db = SessionLocal()
    tareas = db.query(TareaDB).all()
    db.close()
    return [{"titulo": t.titulo, "descripcion": t.descripcion, ...} for t in tareas]
```

2. **Importar a Supabase**:
   - Ve a Table Editor → tareas
   - Haz clic en "Insert" → "Insert row"
   - O usa SQL Editor:

```sql
INSERT INTO tareas (titulo, descripcion, fecha, hora, completada, prioridad, recordatorio)
VALUES 
  ('Tarea 1', 'Descripción', '2025-12-20', '10:00', false, 'alta', 15),
  ('Tarea 2', 'Descripción', '2025-12-21', '14:00', false, 'media', 0);
```

---

## Próximos Pasos (Opcional)

1. **Autenticación**: Agregar login con Supabase Auth
2. **Usuarios múltiples**: Cada usuario ve solo sus tareas
3. **Tiempo real**: Sincronización automática entre dispositivos
4. **Búsqueda**: Filtrar tareas por texto
5. **Categorías**: Organizar tareas por proyectos

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Desplegar a Vercel
vercel --prod

# Ver logs de Vercel
vercel logs
```

---

## Recursos

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Soporte

Si tienes problemas:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs en la consola del navegador (F12)
3. Revisa el dashboard de Supabase (Table Editor, SQL Editor)
4. Pregúntame y te ayudo

---

**¡Disfruta de tu agenda con persistencia real y 100% gratis! 🚀**
