// config/index.ts - Configuración básica

export const CHAT_MODES = [
  {
    id: 'general' as const,
    name: 'General',
    description: 'Respuestas directas basadas en datos',
    icon: 'FileText'
  },
  {
    id: 'creative' as const,
    name: 'Creativo',
    description: 'Análisis creativos con visualizaciones',
    icon: 'Sparkles'
  }
];