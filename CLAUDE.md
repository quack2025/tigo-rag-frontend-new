# Proyecto Tigo RAG Enterprise System

## Resumen del Proyecto
Sistema RAG (Retrieval-Augmented Generation) enterprise para Tigo Honduras con análisis de mercado basado en 1500+ documentos de investigación.

## Estructura del Proyecto

### Backend (FastAPI + Azure OpenAI)
- **Ubicación**: `C:\Users\jorge\proyectos_python\tigo_rag_refactored\`
- **Archivo principal**: `main.py`
- **Puerto**: 8000
- **Entorno virtual**: `tigo_rag_env_310` (Python 3.10)
- **Comando inicio**: 
  ```bash
  cd C:\Users\jorge\proyectos_python\tigo_rag_refactored
  ..\tigo_rag_env_310\Scripts\activate
  python main.py
  ```

### Frontend (React + TypeScript + Vite)
- **Ubicación**: `C:\Users\jorge\proyectos_python\tigo_rag_frontend_new\`
- **Puerto**: 5173
- **Comando inicio**:
  ```bash
  cd C:\Users\jorge\proyectos_python\tigo_rag_frontend_new
  npm run dev
  ```

## Funcionalidades Implementadas

### Core
- ✅ Autenticación JWT segura
- ✅ **Arquitectura Modular**: 3 módulos independientes con UX separadas
- ✅ Sistema de citas con metadata
- ✅ Renderizado Markdown
- ✅ Almacenamiento persistente por módulo

### Módulos Implementados

#### 1. **RAG General** (`/general`)
- Consultas directas basadas en documentos
- Filtros avanzados (Región, Año, Metodología, Tipo de Estudio)
- Búsqueda semántica en historial
- Respuestas con citas documentadas
- Diseño azul corporativo

#### 2. **RAG Creativo** (`/creative`)  
- Insights estratégicos y visualizaciones automáticas
- Nivel de creatividad ajustable (0-100%)
- Recomendaciones estratégicas
- Análisis de tendencias predictivas
- Diseño gradiente púrpura/rosa

#### 3. **Evaluación de Campañas** (`/synthetic`)
- **Caso de uso específico**: Evaluación de campañas de comunicación y conceptos de producto
- **6 arquetipos hondureños**: PROFESIONAL, CONTROLADOR, EMPRENDEDOR, GOMOSO/EXPLORADOR, PRAGMÁTICO, RESIGNADO
- **Formulario estructurado**: Nombre, descripción, beneficios, diferenciación, precio, público objetivo, canal, tono, call-to-action
- **Evaluación por variables**: Cada arquetipo evalúa 9 aspectos específicos del concepto (0-100 puntos)
- **Reacciones detalladas**: Feedback textual, sentiment analysis y sugerencias de mejora por segmento
- **Insights accionables**: Identificación de fortalezas, debilidades y oportunidades específicas
- **Historial y exportación**: Seguimiento de evaluaciones anteriores con exportación JSON
- Diseño gradiente verde esmeralda

### Enterprise Features
- ✅ **Pantalla de Selección Modular**: Landing con 3 opciones claras
- ✅ **Configuración Independiente**: Cada módulo mantiene su propio estado
- ✅ **Exportación por Módulo**: JSON con metadata específica
- ✅ **Navegación Intuitiva**: Botones de regreso y cambio de módulo
- ✅ **Responsive Design**: Optimizado para escritorio y móvil

## Flujo de Evaluación de Campañas

### Paso 1: Creación del Concepto
El usuario completa un formulario estructurado con:
- **Información básica**: Nombre, descripción, público objetivo
- **Propuesta de valor**: Beneficios principales y diferenciación
- **Detalles de implementación**: Canal, tono, call-to-action, precio (para productos)
- **Tipo**: Campaña de comunicación vs Concepto de producto

### Paso 2: Selección de Arquetipos
- Selección múltiple de los 6 arquetipos hondureños
- Vista detallada de cada arquetipo con características, demographics y insights típicos
- Información del tiempo estimado de evaluación

### Paso 3: Evaluación Automática
- Cada arquetipo seleccionado evalúa **9 variables** del concepto:
  - Nombre, Descripción, Beneficios, Diferenciación
  - Precio, Público Objetivo, Canal, Tono, Call-to-Action
- Generación de **reacciones auténticas** basadas en el perfil psicológico de cada arquetipo
- Cálculo de **scores específicos** (0-100) y **sentiment analysis**

### Paso 4: Resultados Detallados
- **Vista Resumen**: Comparación rápida de todos los arquetipos evaluados
- **Vista Detallada**: Análisis profundo variable por variable
- **Insights específicos**: Fortalezas, preocupaciones y sugerencias de mejora
- **Métricas de adopción**: Likelihood to adopt/recommend por arquetipo

### Funcionalidades Avanzadas
- **Historial completo**: Todas las evaluaciones se guardan automáticamente
- **Exportación profesional**: JSON detallado con toda la información
- **Navegación fluida**: Fácil cambio entre arquetipos y variables
- **Feedback contextual**: Cada reacción incluye el contexto cultural hondureño

## Credenciales de Acceso
- admin / admin123
- user / user123  
- tigo / tigo2024

## Tecnologías Principales
- **Backend**: FastAPI, Azure OpenAI, Azure AI Search, ChromaDB
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **IA**: GPT-4, text-embedding-3-large
- **Vector Store**: Azure AI Search (1500+ docs indexados)

## Próximas Mejoras Pendientes
1. Analytics Dashboard con métricas de uso
2. Exportación profesional PDF/Word
3. Sistema de colaboración/compartir chats
4. Plantillas de preguntas frecuentes
5. Comparación temporal de insights
6. Alertas inteligentes sobre cambios en métricas

## Problemas Resueltos
- Python 3.13 incompatible con numpy → Usar Python 3.10
- Archivos con caracteres \n literales → Recreados correctamente
- CORS configurado para localhost:5173
- Imports de tipos TypeScript con 'type' prefix

## Metadata Disponible para Filtros
- **Regiones**: Nacional, Tegucigalpa, San Pedro Sula, Zona Norte/Sur/Oriental/Occidental
- **Años**: 2019-2024
- **Metodologías**: Encuestas, Focus Groups, Entrevistas, Mystery Shopping, etc.
- **Tipos de Estudio**: Brand Health, Customer Experience, Market Share, etc.

## Notas Importantes
- El sistema usa Azure OpenAI (no OpenAI directo)
- Los embeddings son de 3072 dimensiones
- El índice "tigo-insights" tiene documentos de estudios de mercado hondureño
- Configuración en `config/tigo_config.json`

## Última Actualización
- Fecha: Enero 2025
- Estado: Sistema completamente funcional con características enterprise
- Desarrollador: Jorge con asistencia de Claude