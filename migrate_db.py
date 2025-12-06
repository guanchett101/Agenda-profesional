"""
Script para migrar la base de datos y agregar la columna recordatorio
"""
import sqlite3
import os

# Conectar a la base de datos
db_path = os.getenv('DATABASE_PATH', './agenda.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Verificar si la columna recordatorio existe
    cursor.execute("PRAGMA table_info(tareas)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'recordatorio' not in columns:
        print("Agregando columna 'recordatorio' a la tabla tareas...")
        cursor.execute("ALTER TABLE tareas ADD COLUMN recordatorio INTEGER DEFAULT 0")
        conn.commit()
        print("✅ Columna 'recordatorio' agregada exitosamente")
    else:
        print("✅ La columna 'recordatorio' ya existe")
    
    # Mostrar estructura de la tabla
    cursor.execute("PRAGMA table_info(tareas)")
    print("\nEstructura actual de la tabla 'tareas':")
    for column in cursor.fetchall():
        print(f"  - {column[1]} ({column[2]})")
        
except Exception as e:
    print(f"❌ Error: {e}")
    conn.rollback()
finally:
    conn.close()
