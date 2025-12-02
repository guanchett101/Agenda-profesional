# 🌍 Desplegar Agenda en Internet

## 🎯 Opción Recomendada: Railway + Vercel (GRATIS)

### 📦 Paso 1: Preparar el código

Ya está listo con los archivos:
- `Procfile` - Comando para ejecutar el backend
- `runtime.txt` - Versión de Python
- `.gitignore` - Archivos a ignorar

---

## 🚂 Backend en Railway

### 1. Crear cuenta en Railway
- Ve a: https://railway.app
- Regístrate con GitHub (gratis)

### 2. Crear nuevo proyecto
- Click en "New Project"
- Selecciona "Deploy from GitHub repo"
- Conecta tu repositorio (o sube el código)

### 3. Configurar variables de entorno
En Railway, agrega:
```
PORT=8000
```

### 4. Obtener URL del backend
Railway te dará una URL como:
```
https://tu-proyecto.railway.app
```

---

## ⚡ Frontend en Vercel

### 1. Crear cuenta en Vercel
- Ve a: https://vercel.com
- Regístrate con GitHub (gratis)

### 2. Configurar la URL del backend

Edita `frontend/src/App.tsx`:

```typescript
const API_URL = 'https://tu-proyecto.railway.app';
```

### 3. Desplegar
- Click en "New Project"
- Selecciona la carpeta `frontend`
- Vercel detectará automáticamente que es Vite
- Click en "Deploy"

### 4. Obtener URL del frontend
Vercel te dará una URL como:
```
https://tu-agenda.vercel.app
```

---

## 🔧 Alternativa: Render (Todo en uno)

### Backend + Frontend en Render

1. **Crear cuenta**: https://render.com
2. **Nuevo Web Service** para el backend
3. **Nuevo Static Site** para el frontend

---

## 🏠 Opción 2: Exponer tu PC (NO RECOMENDADO)

Si aún así quieres hacerlo:

### 1. Obtener IP pública
```bash
curl ifconfig.me
```

### 2. Configurar Port Forwarding en tu router

Accede a tu router (usualmente `192.168.1.1`):
- Busca "Port Forwarding" o "NAT"
- Redirige puerto externo 8000 → IP local:8000
- Redirige puerto externo 5173 → IP local:5173

### 3. Usar servicio de DNS dinámico

Si tu IP cambia:
- **No-IP**: https://www.noip.com (gratis)
- **DuckDNS**: https://www.duckdns.org (gratis)

Te dan un dominio como: `tu-agenda.ddns.net`

### 4. Configurar HTTPS (obligatorio)

Usa **Cloudflare Tunnel** (gratis):
```bash
# Instalar cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Autenticar
cloudflared tunnel login

# Crear túnel
cloudflared tunnel create agenda

# Configurar
cloudflared tunnel route dns agenda tu-dominio.com

# Ejecutar
cloudflared tunnel run agenda
```

### ⚠️ Problemas de esta opción:
- Tu PC debe estar siempre encendida
- Consume tu ancho de banda
- Riesgos de seguridad
- IP puede cambiar
- Configuración compleja

---

## 📊 Comparación de opciones:

| Característica | Railway/Vercel | Exponer PC |
|----------------|----------------|------------|
| **Costo** | Gratis | Electricidad |
| **Seguridad** | ✅ Alta | ⚠️ Baja |
| **Disponibilidad** | ✅ 24/7 | ⚠️ Solo si PC encendida |
| **Velocidad** | ✅ Rápida | ⚠️ Depende de tu Internet |
| **Configuración** | ✅ Fácil | ⚠️ Compleja |
| **Mantenimiento** | ✅ Automático | ⚠️ Manual |
| **SSL/HTTPS** | ✅ Incluido | ⚠️ Debes configurar |

---

## 🎯 Recomendación Final:

**Usa Railway + Vercel** (o Render):
- ✅ Gratis
- ✅ Fácil de configurar
- ✅ Seguro
- ✅ Rápido
- ✅ Siempre disponible
- ✅ HTTPS automático

**NO expongas tu PC a Internet** a menos que:
- Sepas mucho de seguridad
- Tengas IP estática
- Necesites control total
- Tengas servidor dedicado

---

## 📚 Recursos:

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **FastAPI Deploy**: https://fastapi.tiangolo.com/deployment/

---

## 🆘 Ayuda:

Si necesitas ayuda para desplegar:
1. Crea una cuenta en Railway y Vercel
2. Sube tu código a GitHub
3. Sigue los pasos de esta guía
4. Si tienes problemas, revisa los logs en cada plataforma

¡Buena suerte! 🚀
