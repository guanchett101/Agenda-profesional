import { createClient } from '@supabase/supabase-js';

// Credenciales de Supabase
const supabaseUrl = 'https://ehprsvfvcncbqggjwegv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocHJzdmZ2Y25jYnFnZ2p3ZWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDk4ODYsImV4cCI6MjA4MTQ4NTg4Nn0.Jcl_KDKmmGJEqTLNYGuEFhv7AhtSnod0Rs5YgD83naA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos
export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  recordatorio: number;
  user_id?: number;
  created_at?: string;
}

export interface Usuario {
  id: number;
  username: string;
  password: string;
  es_admin: boolean;
  created_at?: string;
}
