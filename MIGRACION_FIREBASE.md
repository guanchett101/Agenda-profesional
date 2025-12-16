# 🔥 Guía de Migración a Firebase

## ¿Por qué Firebase?

✅ **100% GRATIS** sin tarjeta de crédito (plan Spark)
✅ **Persistencia real** de datos con Firestore
✅ **Sin backend Python** - todo desde el frontend
✅ **SSL automático** y CDN global
✅ **No se duerme** como Render
✅ **Hosting rápido** con Firebase Hosting

---

## Paso 1: Crear Proyecto Firebase

1. Ve a https://console.firebase.google.com
2. Haz clic en "Agregar proyecto"
3. Nombre: `agenda-igara` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

---

## Paso 2: Configurar Firestore Database

1. En el menú lateral, ve a **"Compilación" → "Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de producción"**
4. Elige la ubicación más cercana (ej: `southamerica-east1` para Sudamérica)
5. Haz clic en **"Habilitar"**

### Configurar Reglas de Seguridad

En la pestaña "Reglas", reemplaza con esto (permite lectura/escritura pública):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tareas/{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas reglas son para desarrollo. Para producción, deberías agregar autenticación.

---

## Paso 3: Registrar App Web

1. En la página principal del proyecto, haz clic en el ícono **</>** (Web)
2. Nombre de la app: `agenda-igara-web`
3. **NO** marques "Firebase Hosting" todavía
4. Haz clic en **"Registrar app"**
5. **COPIA** las credenciales que aparecen (algo como esto):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "agenda-igara.firebaseapp.com",
  projectId: "agenda-igara",
  storageBucket: "agenda-igara.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## Paso 4: Instalar Dependencias

```bash
cd agenda-profesional/frontend

# Instalar Firebase SDK
npm install firebase

# Instalar Firebase CLI (global)
npm install -g firebase-tools
```

---

## Paso 5: Configurar Firebase en el Proyecto

1. Abre `frontend/src/firebase.ts`
2. **Reemplaza** las credenciales con las que copiaste en el Paso 3:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

---

## Paso 6: Cambiar a la Versión Firebase

1. Abre `frontend/src/main.tsx`
2. Cambia la importación:

```typescript
// ANTES:
import App from './App.tsx'

// DESPUÉS:
import App from './AppFirebase.tsx'
```

---

## Paso 7: Probar Localmente

```bash
cd agenda-profesional/frontend

# Compilar
npm run build

# Probar localmente
npm run dev
```

Abre http://localhost:5173 y verifica que:
- ✅ Se carguen las tareas
- ✅ Puedas crear nuevas tareas
- ✅ Puedas editar y eliminar tareas
- ✅ Los datos persistan al recargar la página

---

## Paso 8: Desplegar en Firebase Hosting

```bash
cd agenda-profesional/frontend

# Iniciar sesión en Firebase
firebase login

# Inicializar Firebase en el proyecto
firebase init

# Selecciona:
# - Hosting (usa espacio para seleccionar, Enter para continuar)
# - Use an existing project → selecciona tu proyecto
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds with GitHub: No
# - Overwrite dist/index.html: No

# Compilar el proyecto
npm run build

# Desplegar
firebase deploy
```

---

## Paso 9: ¡Listo! 🎉

Tu app estará disponible en:
```
https://TU_PROJECT_ID.web.app
```

O en:
```
https://TU_PROJECT_ID.firebaseapp.com
```

---

## Ventajas de Firebase vs Render

| Característica | Firebase | Render |
|---------------|----------|--------|
| **Persistencia** | ✅ Real con Firestore | ❌ SQLite efímero |
| **Costo** | ✅ Gratis sin tarjeta | ⚠️ Requiere tarjeta |
| **Sleep mode** | ✅ Nunca se duerme | ❌ Se duerme tras 15 min |
| **Backend** | ✅ No necesario | ❌ Requiere Python |
| **SSL** | ✅ Automático | ✅ Automático |
| **CDN** | ✅ Global | ⚠️ Limitado |
| **Velocidad** | ✅ Muy rápido | ⚠️ Lento al despertar |

---

## Límites del Plan Gratuito (Spark)

- **Firestore**: 1 GB almacenamiento, 50K lecturas/día, 20K escrituras/día
- **Hosting**: 10 GB almacenamiento, 360 MB/día transferencia
- **Más que suficiente** para uso personal o pequeños equipos

---

## Migrar Datos Existentes (Opcional)

Si tienes tareas en Render que quieres conservar:

1. Exporta desde Render (crea un endpoint `/export` temporal)
2. Importa a Firestore usando el script:

```typescript
// importar-tareas.ts
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const tareasExistentes = [
  // Pega aquí tus tareas exportadas
];

async function importar() {
  for (const tarea of tareasExistentes) {
    await addDoc(collection(db, 'tareas'), tarea);
  }
  console.log('✅ Importación completada');
}

importar();
```

---

## Solución de Problemas

### Error: "Firebase not initialized"
- Verifica que hayas copiado correctamente las credenciales en `firebase.ts`

### Error: "Permission denied"
- Revisa las reglas de Firestore (Paso 2)

### Error: "Module not found: firebase"
- Ejecuta `npm install firebase` en la carpeta `frontend`

### Las tareas no se guardan
- Abre la consola del navegador (F12) y busca errores
- Verifica que Firestore esté habilitado en Firebase Console

---

## Próximos Pasos (Opcional)

1. **Autenticación**: Agregar Firebase Authentication para usuarios privados
2. **Notificaciones**: Usar Firebase Cloud Messaging para recordatorios
3. **Offline**: Habilitar persistencia offline de Firestore
4. **PWA**: Convertir en Progressive Web App

---

## Comandos Útiles

```bash
# Ver logs de despliegue
firebase hosting:channel:list

# Desplegar a un canal de prueba
firebase hosting:channel:deploy preview

# Ver uso de Firestore
firebase firestore:usage

# Eliminar despliegue
firebase hosting:disable
```

---

## Soporte

- Documentación Firebase: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore
- Hosting: https://firebase.google.com/docs/hosting

---

**¡Disfruta de tu agenda con persistencia real y 100% gratis! 🚀**
