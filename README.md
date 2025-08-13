# Tigo RAG Frontend

Frontend moderno para el sistema RAG de Tigo Honduras, construido con React + TypeScript + Vite.

## 🚀 Características

- ✅ **Autenticación segura** con JWT
- 📊 **Visualizaciones interactivas** (gráficos, tablas)
- 🎯 **Modos de chat** (General y Creativo)
- 📤 **Exportación** de conversaciones (JSON, CSV, TXT)
- 🎨 **Interfaz moderna** con Tailwind CSS
- 📱 **Responsive design**
- 🔐 **Preparado para usuarios sintéticos**

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend RAG ejecutándose (puerto 8000 por defecto)

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir http://localhost:5173
```

## 🛠️ Configuración

### Variables de Entorno

Edita el archivo `.env`:

```env
# URL del backend RAG
VITE_API_URL=http://localhost:8000

# Secret para JWT (usar uno seguro en producción)
VITE_JWT_SECRET=tu-jwt-secret-super-seguro-aqui

# Configuración de la app
VITE_APP_ENV=development
VITE_APP_NAME="Tigo RAG System"
VITE_DEBUG=true
```

### Configuración del Backend

Asegúrate de que tu backend FastAPI tenga configurado CORS para permitir el frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend en desarrollo
        "https://tu-frontend.vercel.app",  # Frontend en producción
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run preview      # Preview de la build

# Producción
npm run build        # Build para producción
npm run type-check   # Verificar tipos TypeScript
npm run lint         # Linter ESLint
```

## 🚀 Deploy en la Nube

### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en Vercel dashboard:
# VITE_API_URL=https://tu-backend.com
# VITE_JWT_SECRET=tu-secret-productivo
# VITE_APP_ENV=production
```

### Netlify

```bash
# 1. Build local
npm run build

# 2. Subir carpeta dist/ a Netlify
# 3. Configurar variables de entorno en Netlify dashboard
```

## 🔐 Autenticación

El sistema usa autenticación JWT simple:

- **Login**: `POST /api/auth/login` con `{ username, password }`
- **Token**: Se almacena en localStorage como `tigo_auth_token`
- **Headers**: Cada request incluye `Authorization: Bearer <token>`

### Usuarios de Prueba

El backend debe proveer estos endpoints de autenticación o puedes usar credenciales hardcodeadas para testing inicial.

## 💬 Uso del Chat

### Modos Disponibles

1. **General**: Para consultas normales de información
2. **Creativo**: Para análisis creativos y explorativos

### Visualizaciones

El frontend soporta automáticamente:

- 📊 Gráficos de barras
- 📈 Gráficos de línea  
- 🥧 Gráficos circulares
- 📋 Tablas de datos
- 📤 Exportación de gráficos como PNG/CSV

### Exportación

Exporta conversaciones completas en:

- **JSON**: Datos estructurados con metadatos
- **CSV**: Para análisis en Excel/Sheets
- **TXT**: Texto plano legible

## 🧪 Usuarios Sintéticos

El frontend está preparado para la funcionalidad de usuarios sintéticos:

- Componente `SyntheticUserManager` listo para integrar
- API endpoints preparados en `/api/synthetic-users/*`
- UI para crear y gestionar usuarios sintéticos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Autenticación
│   ├── Chat/           # Chat y mensajes
│   └── Common/         # Componentes comunes
├── lib/                # Librerías y utilidades
│   ├── auth.ts         # Sistema de autenticación
│   ├── api.ts          # Cliente API
│   └── utils.ts        # Funciones utilitarias
├── types/              # Tipos TypeScript
├── config/             # Configuración
└── styles/             # Estilos CSS
```

## 🤝 Integración con Backend

El frontend espera estos endpoints del backend:

```
POST /api/auth/login           # Autenticación
POST /api/chat                 # Chat principal
GET  /api/health              # Health check
POST /api/synthetic-users/*   # Usuarios sintéticos (futuro)
```

## 🐛 Solución de Problemas

### Error de CORS
```bash
# Verificar que el backend tenga CORS configurado
# Verificar que VITE_API_URL esté correcta
```

### Error de Autenticación
```bash
# Verificar que el JWT_SECRET sea el mismo en frontend y backend
# Verificar que el endpoint /api/auth/login funcione
```

### Error de Build
```bash
npm run type-check  # Verificar errores de TypeScript
npm run lint        # Verificar errores de ESLint
```

## 📞 Soporte

Este frontend está diseñado específicamente para el sistema RAG de Tigo Honduras. Para modificaciones o soporte, contacta al equipo de desarrollo.

## 🔄 Próximos Pasos

1. ✅ Frontend base completado
2. 🔄 Deploy en la nube
3. ⏳ Integración completa con usuarios sintéticos
4. ⏳ Optimizaciones de performance
5. ⏳ Tests automatizados
