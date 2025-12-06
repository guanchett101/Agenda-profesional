# 🚀 Desplegar en Render

## Opción 1: Despliegue Automático (Recomendado)

1. **Sube el código a GitHub** (ya hecho ✅)

2. **Ve a Render**: https://render.com

3. **Crea el Backend**:
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: `agenda-igara-backend`
     - **Root Directory**: `.` (raíz)
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn backend:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free
   - Click "Create Web Service"
   - **Copia la URL** que te da (ej: `https://agenda-igara-backend.onrender.com`)

4. **Crea el Frontend**:
   - Click en "New +" → "Static Site"
   - Conecta el mismo repositorio
   - Configuración:
     - **Name**: `agenda-igara-frontend`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Plan**: Free
   - En "Environment Variables" agrega:
     - **Key**: `VITE_API_URL`
     - **Value**: La URL del backend que copiaste (ej: `https://agenda-igara-backend.onrender.com`)
   - Click "Create Static Site"

5. **¡Listo!** 🎉
   - Tu agenda estará disponible en la URL del frontend
   - Ejemplo: `https://agenda-igara.onrender.com`

---

## Opción 2: Usando render.yaml

Si tienes el archivo `render.yaml` configurado:

1. Ve a Render Dashboard
2. Click en "New +" → "Blueprint"
3. Conecta tu repositorio
4. Render detectará automáticamente el `render.yaml`
5. Click "Apply"

---

## 🔧 Configuración Manual de Variables

Si necesitas cambiar la URL del backend después:

1. Ve al frontend en Render
2. Click en "Environment"
3. Edita `VITE_API_URL` con la nueva URL del backend
4. Click "Save Changes"
5. El sitio se reconstruirá automáticamente

---

## 📝 Notas Importantes

- **Primera vez**: El despliegue puede tardar 5-10 minutos
- **Plan Free**: El backend se duerme después de 15 minutos sin uso
- **Primera petición**: Puede tardar 30-60 segundos en despertar
- **Base de datos**: Se crea automáticamente en el backend

---

## 🐛 Solución de Problemas

### Error: "NetworkError when attempting to fetch"
- Verifica que `VITE_API_URL` esté configurado correctamente
- Asegúrate de que el backend esté desplegado y funcionando
- Revisa los logs del backend en Render

### Backend no responde
- Ve a los logs del backend en Render
- Verifica que la migración de base de datos se ejecutó correctamente
- Busca el mensaje: "✅ Migración completada"

### Frontend muestra página en blanco
- Revisa los logs de build del frontend
- Verifica que `npm run build` se ejecutó sin errores
- Asegúrate de que `VITE_API_URL` esté definido

---

## 🔄 Actualizaciones Automáticas

Cada vez que hagas `git push` a GitHub:
- Render detectará los cambios automáticamente
- Reconstruirá y desplegará la nueva versión
- Tarda aproximadamente 2-5 minutos

---

## 💡 Tips

- **Logs**: Siempre revisa los logs en Render si algo falla
- **HTTPS**: Render proporciona HTTPS automáticamente
- **Dominio personalizado**: Puedes agregar tu propio dominio en la configuración
- **Monitoreo**: Render te envía emails si el servicio falla

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el código funciona localmente primero
4. Consulta la documentación de Render: https://render.com/docs

¡Buena suerte! 🚀
