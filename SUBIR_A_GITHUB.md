# 📤 Guía: Subir tu Agenda a GitHub (Para Principiantes)

## ✅ Paso 1: Crear repositorio en GitHub

1. **Abre tu navegador** y ve a: https://github.com
2. **Inicia sesión** con tu cuenta
3. **Click en el botón verde** "New" o "+" arriba a la derecha
4. **Selecciona** "New repository"

### Configuración del repositorio:

- **Repository name:** `agenda-profesional`
- **Description:** `Agenda profesional con calendario y tareas`
- **Public o Private:** Elige lo que prefieras
- ⚠️ **NO marques** "Add a README file"
- ⚠️ **NO marques** "Add .gitignore"
- **Click en** "Create repository"

---

## ✅ Paso 2: Conectar tu proyecto con GitHub

GitHub te mostrará una página con comandos. **Copia la URL** que aparece arriba, algo como:
```
https://github.com/tu-usuario/agenda-profesional.git
```

### En tu terminal, ejecuta:

```bash
cd ~/Escritorio/web\ project/agenda-profesional

# Conectar con GitHub (reemplaza con TU URL)
git remote add origin https://github.com/TU-USUARIO/agenda-profesional.git

# Cambiar rama a main (GitHub usa main en lugar de master)
git branch -M main

# Subir el código
git push -u origin main
```

### Si te pide usuario y contraseña:

GitHub ya no acepta contraseñas. Necesitas un **Personal Access Token**:

1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Dale un nombre: "Agenda Profesional"
4. Marca el checkbox: **repo** (todos los permisos de repo)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. Usa el token como contraseña cuando Git te lo pida

---

## ✅ Paso 3: Verificar que se subió

1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. ¡Listo! Tu código está en GitHub 🎉

---

## 🚂 Paso 4: Desplegar Backend en Railway

### 1. Ir a Railway
- Ve a: https://railway.app
- Click en "Start a New Project"
- **Login with GitHub**

### 2. Crear proyecto
- Click en "Deploy from GitHub repo"
- Selecciona tu repositorio `agenda-profesional`
- Railway detectará automáticamente que es Python

### 3. Configurar
- Railway creará el servicio automáticamente
- Espera a que termine de desplegar (2-3 minutos)
- Click en tu servicio → "Settings" → "Generate Domain"
- **Copia la URL** que te da, algo como:
  ```
  https://agenda-profesional-production.up.railway.app
  ```

### 4. Verificar
- Abre la URL en tu navegador
- Deberías ver: `{"mensaje":"API de Agenda Profesional funcionando"}`
- ✅ ¡Backend funcionando!

---

## ⚡ Paso 5: Desplegar Frontend en Vercel

### 1. Ir a Vercel
- Ve a: https://vercel.com
- Click en "Start Deploying"
- **Continue with GitHub**

### 2. Importar proyecto
- Click en "Add New..." → "Project"
- Selecciona tu repositorio `agenda-profesional`
- Click en "Import"

### 3. Configurar
En la configuración:

**Root Directory:**
- Click en "Edit"
- Selecciona: `frontend`

**Build Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

**Environment Variables:**
- Click en "Add"
- Name: `VITE_API_URL`
- Value: `https://tu-backend.railway.app` (la URL de Railway)

### 4. Desplegar
- Click en "Deploy"
- Espera 2-3 minutos
- ✅ ¡Listo!

### 5. Obtener URL
Vercel te dará una URL como:
```
https://agenda-profesional.vercel.app
```

---

## 🎯 Paso 6: Actualizar la URL del backend en el código

### Opción A: Variable de entorno (RECOMENDADO)

Edita `frontend/src/App.tsx`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
```

### Opción B: URL fija

```typescript
const API_URL = 'https://tu-backend.railway.app';
```

### Subir cambios:

```bash
cd ~/Escritorio/web\ project/agenda-profesional
git add .
git commit -m "Actualizar URL del backend"
git push
```

Vercel detectará el cambio y redesplegará automáticamente.

---

## 📱 Paso 7: ¡Usar tu agenda desde Internet!

Ahora puedes acceder desde cualquier lugar:

```
https://agenda-profesional.vercel.app
```

Comparte esta URL con quien quieras. ¡Funciona desde cualquier dispositivo con Internet!

---

## 🔄 Actualizar tu agenda en el futuro

Cuando hagas cambios:

```bash
cd ~/Escritorio/web\ project/agenda-profesional

# Ver cambios
git status

# Agregar cambios
git add .

# Guardar cambios
git commit -m "Descripción de lo que cambiaste"

# Subir a GitHub
git push
```

Railway y Vercel detectarán los cambios y actualizarán automáticamente.

---

## 🆘 Problemas comunes

### "Permission denied"
Necesitas configurar SSH o usar Personal Access Token (ver Paso 2).

### "Failed to push"
Verifica que la URL del repositorio sea correcta:
```bash
git remote -v
```

### "Build failed" en Vercel
Revisa los logs en Vercel para ver el error específico.

### Backend no responde
Verifica los logs en Railway → Tu servicio → "Deployments" → Click en el último → "View Logs"

---

## 💡 Consejos

- ✅ Usa nombres descriptivos en los commits
- ✅ Haz commits frecuentes (cada vez que algo funcione)
- ✅ Revisa los logs si algo falla
- ✅ Guarda tu Personal Access Token en un lugar seguro

---

## 🎉 ¡Felicidades!

Ahora tienes tu agenda profesional:
- ✅ En GitHub (código respaldado)
- ✅ En Railway (backend en la nube)
- ✅ En Vercel (frontend accesible desde Internet)
- ✅ Gratis y disponible 24/7

**URL de tu agenda:** `https://tu-agenda.vercel.app`

¡Compártela con quien quieras! 🚀
