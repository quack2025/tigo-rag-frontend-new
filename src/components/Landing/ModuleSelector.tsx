// components/Landing/ModuleSelector.tsx - Pantalla de selección de módulos

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Users, LogOut, Settings, BarChart3, User, Brain, FileText, Video, TrendingUp } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface ModuleSelectorProps {
  className?: string;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { logout, getUser } = useAuth();
  const user = getUser();

  const modules = [
    {
      id: 'general',
      title: 'RAG General',
      subtitle: 'Consultas directas y análisis de datos',
      description: 'Accede a insights precisos basados en documentos de investigación de mercado. Ideal para análisis específicos, reportes ejecutivos y consultas puntuales.',
      icon: Bot,
      color: 'blue',
      features: [
        'Respuestas basadas en datos reales',
        'Citas y fuentes documentadas', 
        'Filtros por región, año y metodología',
        'Exportación de conversaciones',
        'Búsqueda en historial'
      ],
      route: '/general',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'creative',
      title: 'RAG Creativo',
      subtitle: 'Insights estratégicos y visualizaciones',
      description: 'Genera análisis innovadores, visualizaciones interactivas y recomendaciones estratégicas. Perfecto para brainstorming y planificación.',
      icon: Sparkles,
      color: 'purple',
      features: [
        'Visualizaciones automáticas',
        'Recomendaciones estratégicas',
        'Análisis de tendencias',
        'Insights predictivos',
        'Dashboard interactivo'
      ],
      route: '/creative',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'synthetic',
      title: 'Usuarios Sintéticos',
      subtitle: 'Investigación con personas virtuales',
      description: 'Conversa con 6 arquetipos hondureños realistas, simula focus groups y valida conceptos. Sistema ético de investigación cualitativa.',
      icon: Users,
      color: 'emerald',
      features: [
        '6 arquetipos de consumidores hondureños',
        '80 características configurables',
        'Simulador de focus groups',
        'Validación ética anti-sesgo',
        'Role prompting avanzado'
      ],
      route: '/synthetic',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Ejecutivo',
      subtitle: 'Analytics y métricas en tiempo real',
      description: 'Panel ejecutivo con métricas profesionales, ROI de campañas y análisis de performance. Visualización de datos nivel consultora.',
      icon: BarChart3,
      color: 'orange',
      features: [
        'Métricas de ROI en tiempo real',
        'Análisis de performance de campañas',
        'Heatmaps de engagement',
        'Reportes comparativos',
        'KPIs personalizados'
      ],
      route: '/dashboard',
      gradient: 'from-orange-500 to-red-500',
      badge: 'PREMIUM'
    },
    {
      id: 'predictor',
      title: 'Predictor ML',
      subtitle: 'Inteligencia artificial predictiva',
      description: 'Sistema de Machine Learning que predice el éxito de campañas antes del lanzamiento. Recomendaciones de optimización automáticas.',
      icon: Brain,
      color: 'indigo',
      features: [
        'Predicción de éxito pre-lanzamiento',
        'Recomendaciones de optimización',
        'Análisis de riesgo por segmento',
        'A/B testing sugerencias',
        'Modelo entrenado con historial'
      ],
      route: '/predictor',
      gradient: 'from-indigo-500 to-purple-600',
      badge: 'AI POWERED'
    },
    {
      id: 'reports',
      title: 'Reportes Automáticos',
      subtitle: 'Generación IA de documentos',
      description: 'Generación automática de reportes ejecutivos con visualizaciones IA. Infografías y documentos profesionales en minutos.',
      icon: FileText,
      color: 'teal',
      features: [
        'Reportes PDF automáticos',
        'Infografías generadas por IA',
        'Templates personalizables',
        'Visualizaciones profesionales',
        'Programación de reportes'
      ],
      route: '/reports',
      gradient: 'from-teal-500 to-cyan-500',
      badge: 'DALL-E 3'
    },
    {
      id: 'video',
      title: 'Video Analysis',
      subtitle: 'Análisis facial y de emociones',
      description: 'Análisis avanzado de videos con detección de emociones y micro-expresiones. Compara lo que dicen vs lo que sienten.',
      icon: Video,
      color: 'rose',
      features: [
        'Detección de emociones faciales',
        'Análisis de micro-expresiones',
        'Timeline de engagement emocional',
        'Comparación sentiment vs verbal',
        'Heatmaps de emotional journey'
      ],
      route: '/video',
      gradient: 'from-rose-500 to-pink-500',
      badge: 'PRÓXIMAMENTE',
      disabled: true
    }
  ];

  const handleModuleSelect = (route: string, disabled?: boolean) => {
    if (disabled) {
      alert('Esta funcionalidad estará disponible próximamente. ¡Mantente atento!');
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-gray-50 to-blue-50', className)}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tigo RAG System
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema Integral de Análisis e Investigación
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || 'Usuario'}
                </span>
              </div>
              
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                title="Configuración global"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenido, {user?.username}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Selecciona el módulo que mejor se adapte a tus necesidades de investigación y análisis de mercado
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => (
            <div
              key={module.id}
              className={cn(
                "bg-white rounded-2xl shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group relative",
                module.disabled 
                  ? "opacity-75 cursor-not-allowed" 
                  : "hover:shadow-xl transform hover:-translate-y-1"
              )}
            >
              {/* Badge */}
              {module.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={cn(
                    "px-2 py-1 text-xs font-bold rounded-full",
                    module.badge === 'PRÓXIMAMENTE' && "bg-gray-600 text-white",
                    module.badge === 'PREMIUM' && "bg-orange-500 text-white",
                    module.badge === 'AI POWERED' && "bg-indigo-500 text-white",
                    module.badge === 'DALL-E 3' && "bg-teal-500 text-white"
                  )}>
                    {module.badge}
                  </span>
                </div>
              )}

              {/* Header with gradient */}
              <div className={cn('px-6 py-6 bg-gradient-to-r', module.gradient)}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {module.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {module.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed">
                  {module.description}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Características principales:
                </h4>
                <ul className="space-y-2 mb-6">
                  {module.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={cn('w-1.5 h-1.5 rounded-full', {
                        'bg-blue-500': module.id === 'general',
                        'bg-purple-500': module.id === 'creative',
                        'bg-emerald-500': module.id === 'synthetic',
                        'bg-orange-500': module.id === 'dashboard',
                        'bg-indigo-500': module.id === 'predictor',
                        'bg-teal-500': module.id === 'reports',
                        'bg-rose-500': module.id === 'video'
                      })} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleModuleSelect(module.route, module.disabled)}
                  className={cn(
                    'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-white',
                    module.disabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : cn('bg-gradient-to-r hover:shadow-lg group-hover:scale-105', module.gradient)
                  )}
                  disabled={module.disabled}
                >
                  {module.disabled ? 'Próximamente' : 'Acceder al Módulo'}
                  <module.icon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">1,500+</div>
              <div className="text-sm text-gray-600">Documentos indexados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
              <div className="text-sm text-gray-600">Arquetipos de usuarios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Disponibilidad</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Sistema desarrollado para Tigo Honduras • Basado en Azure OpenAI GPT-4
          </p>
        </div>
      </main>
    </div>
  );
};

export default ModuleSelector;