# 🚀 Tigo RAG Frontend - Guía de Instalación

## ✅ Estado del Proyecto

- ✅ Frontend completo creado
- ✅ Autenticación JWT implementada  
- ✅ Chat con visualizaciones
- ✅ Exportación de conversaciones
- ✅ Backend con endpoints compatibles
- 🔄 Listo para instalación y pruebas

## 🛠️ Instalación Paso a Paso

### 1. Verificar Prerrequisitos

```bash
# Verificar Node.js (debe ser 18+)
node --version

# Verificar npm
npm --version
```

### 2. Instalar Dependencias

```bash
# Navegar a la carpeta del frontend
cd C:\Users\jorge\proyectos_python\tigo_rag_frontend_new

# Instalar todas las dependencias
npm install
```

### 3. Verificar Variables de Entorno

El archivo `.env` ya está configurado con:
```env
VITE_API_URL=http://localhost:8000
VITE_JWT_SECRET=tigo-rag-jwt-secret-2024
VITE_APP_ENV=development
```

### 4. Ejecutar el Frontend

```bash
# Iniciar servidor de desarrollo
npm run dev

# Debería mostrar algo como:
# Local:   http://localhost:5173/
# Network: use --host to expose
```

### 5. Verificar que el Backend esté corriendo

En otra terminal, asegúrate de que el backend esté activo:

```bash
cd C:\Users\jorge\proyectos_python\tigo_rag_refactored
python main.py

# Debería mostrar:
# ✅ RAG system initialization successful
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🔐 Usuarios de Prueba

El backend tiene usuarios predefinidos para testing:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `user` | `user123` | Usuario normal |
| `tigo` | `tigo2024` | Usuario Tigo |

## 🧪 Pruebas de Funcionalidad

### 1. Probar Login
1. Ir a http://localhost:5173
2. Usar cualquiera de las credenciales de arriba
3. Debería redirigir al chat

### 2. Probar Chat General
1. Escribir: "¿Cuáles son las tendencias de telecomunicaciones en Honduras?"
2. Seleccionar modo "General"
3. Enviar mensaje
4. Debería recibir respuesta del sistema RAG

### 3. Probar Chat Creativo
1. Cambiar a modo "Creativo"
2. Escribir: "Crea una tabla comparativa de los operadores móviles"
3. Debería generar visualizaciones y tablas

### 4. Probar Exportación
1. Hacer clic en el botón de exportar (📤)
2. Seleccionar formato (JSON, CSV, TXT)
3. Debería descargar el archivo

## 🚀 Deploy en la Nube

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde la carpeta del frontend
cd C:\Users\jorge\proyectos_python\tigo_rag_frontend_new
vercel

# Seguir las instrucciones:
# - Set up and deploy "tigo_rag_frontend_new"? [Y/n] Y
# - Which scope? Tu cuenta
# - Link to existing project? [y/N] N
# - What's your project's name? tigo-rag-frontend
# - In which directory is your code located? ./
```

### Configurar Variables de Entorno en Vercel

1. Ir a vercel.com dashboard
2. Seleccionar tu proyecto
3. Ir a Settings > Environment Variables
4. Agregar:
   - `VITE_API_URL`: URL de tu backend en producción
   - `VITE_JWT_SECRET`: Secret seguro para JWT
   - `VITE_APP_ENV`: `production`

### Opción 2: Netlify

```bash
# Build para producción
npm run build

# Resultado en carpeta dist/
# Subir contenido de dist/ a Netlify
```

## 🔧 Solución de Problemas Comunes

### Error: "npm install" falla
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: CORS en desarrollo
El backend ya incluye CORS para localhost:5173. Si hay problemas:

1. Verificar que `VITE_API_URL=http://localhost:8000` en `.env`
2. Reiniciar el backend con las nuevas configuraciones CORS

### Error: Autenticación no funciona
1. Verificar que el backend tenga los endpoints de auth
2. Probar directamente: http://localhost:8000/api/auth/login
3. Verificar que las credenciales sean correctas

### Error: Chat no responde
1. Verificar que el endpoint `/api/chat` funcione
2. Probar directamente: http://localhost:8000/api/chat con POST
3. Verificar logs del backend

## 📱 URLs Importantes

- **Frontend Dev**: http://localhost:5173
- **Backend**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 🎯 Próximos Pasos

1. ✅ **Completado**: Frontend y backend listos
2. 🔄 **Actual**: Instalación y pruebas locales  
3. ⏳ **Siguiente**: Deploy en la nube
4. ⏳ **Después**: Integración completa de usuarios sintéticos

## 📞 Soporte

Si encuentras problemas:

1. **Verificar logs**: Consola del navegador (F12) y logs del backend
2. **Verificar endpoints**: Usar http://localhost:8000/docs para probar APIs
3. **Verificar configuración**: Archivos `.env` y configuración CORS
4. **Reiniciar servicios**: Tanto frontend (`Ctrl+C` y `npm run dev`) como backend

¡El sistema está listo para usar! 🚀