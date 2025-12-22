# 🔐 Agregar Sistema de Autenticación

## Paso 1: Ejecutar SQL en Supabase

1. Ve a Supabase → **SQL Editor**
2. Copia y pega este código:

```sql
-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  es_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columna user_id a tareas
ALTER TABLE tareas ADD COLUMN user_id BIGINT REFERENCES usuarios(id);

-- Crear índice
CREATE INDEX idx_tareas_user_id ON tareas(user_id);

-- Insertar usuario admin
INSERT INTO usuarios (username, password, es_admin)
VALUES ('admin', '31853185Ag', true);

-- Desactivar RLS
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;
```

3. Haz clic en **"Run"**
4. Deberías ver: "Success. No rows returned"

## Paso 2: Actualizar el código

Avísame cuando hayas ejecutado el SQL y actualizo el código de la aplicación.

## ¿Qué hace esto?

- ✅ Crea tabla `usuarios` con username, password y rol admin
- ✅ Agrega columna `user_id` a tareas (cada tarea pertenece a un usuario)
- ✅ Crea usuario admin con contraseña `31853185Ag`
- ✅ El admin podrá crear más usuarios
- ✅ Cada usuario verá solo sus tareas
