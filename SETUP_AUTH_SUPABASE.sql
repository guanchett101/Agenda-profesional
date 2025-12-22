-- EJECUTA ESTO EN SUPABASE SQL EDITOR

-- 1. Crear tabla de usuarios
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  es_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar columna user_id a tareas
ALTER TABLE tareas ADD COLUMN user_id BIGINT REFERENCES usuarios(id);

-- 3. Crear índice para búsquedas rápidas
CREATE INDEX idx_tareas_user_id ON tareas(user_id);

-- 4. Insertar usuario admin
INSERT INTO usuarios (username, password, es_admin)
VALUES ('admin', '31853185Ag', true);

-- 5. Desactivar RLS (Row Level Security) para ambas tablas
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;
