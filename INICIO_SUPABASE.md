# 🚀 Inicio Rápido - Supabase (5 minutos)

## Pasos Rápidos

### 1. Crear Cuenta
- Ve a: https://supabase.com
- Inicia sesión con GitHub o Google

### 2. Crear Proyecto
- New project → Nombre: `agenda-igara`
- Region: Más cercana a ti
- Espera 2 minutos

### 3. Crear Tabla
Ve a **SQL Editor** y ejecuta:

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

ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;
```

### 4. Copiar Credenciales
- Settings → API
- Copia:
  - **Project URL**
  - **anon public key**

### 5. Instalar Supabase
```bash
cd agenda-profesional/frontend
npm install @supabase/supabase-js
```

### 6. Configurar
Abre `frontend/src/supabase.ts` y pega tus credenciales:
```typescript
const supabaseUrl = 'TU_PROJECT_URL_AQUI';
const supabaseKey = 'TU_ANON_KEY_AQUI';
```

### 7. Activar
Abre `frontend/src/main.tsx` y cambia:
```typescript
// ANTES:
import App from './App.tsx'

// DESPUÉS:
import App from './AppSupabase.tsx'
```

### 8. Probar
```bash
npm run dev
```

Abre http://localhost:5173 y crea una tarea.

### 9. Verificar
- Ve a Supabase → Table Editor → tareas
- Deberías ver tu tarea guardada

## ✅ ¡Listo!

Ahora tienes:
- ✅ Base de datos real con persistencia
- ✅ 100% gratis sin tarjeta
- ✅ Nunca se duerme
- ✅ Sin backend Python

## Siguiente Paso

Lee `GUIA_SUPABASE.md` para desplegar en internet con Vercel.

## ¿Problemas?

Avísame en qué paso te quedaste y te ayudo.
