# Script para generar AppAuth.tsx con autenticación
import os

# Leer AppSupabase.tsx
with open('src/AppSupabase.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar imports de Usuario
content = content.replace(
    "import { supabase, Tarea } from './supabase';",
    "import { supabase, Tarea, Usuario } from './supabase';"
)

# Agregar estados de autenticación después de la línea de cargando
auth_states = """
  // Estados de autenticación
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarLogin, setMostrarLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUser, setNuevoUser] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');
"""

content = content.replace(
    "  const [cargando, setCargando] = useState(false);",
    "  const [cargando, setCargando] = useState(false);\n" + auth_states
)

# Guardar
with open('src/AppAuth.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ AppAuth.tsx generado")
