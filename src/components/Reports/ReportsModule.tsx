// components/Reports/ReportsModule.tsx - Generación Automática de Reportes con DALL-E 3

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Image,
  Download,
  Sparkles,
  Calendar,
  Settings,
  BarChart3,
  Users,
  Target,
  Palette,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'marketing';
  icon: any;
  color: string;
  features: string[];
  estimated_time: string;
}

interface ReportConfig {
  template_id: string;
  title: string;
  data_source: string;
  include_charts: boolean;
  include_infographics: boolean;
  brand_colors: boolean;
  language: 'spanish' | 'english';
  format: 'pdf' | 'pptx' | 'html';
}

const ReportsModule: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    template_id: '',
    title: '',
    data_source: 'last_30_days',
    include_charts: true,
    include_infographics: true,
    brand_colors: true,
    language: 'spanish',
    format: 'pdf'
  });
  const [generatedReports] = useState([
    {
      id: '1',
      title: 'Análisis Q4 2024 - Tigo Honduras',
      type: 'executive',
      created_at: '2025-01-06T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2', 
      title: 'Focus Group - Tigo 5G Pro',
      type: 'marketing',
      created_at: '2025-01-05T15:45:00Z',
      status: 'completed'
    }
  ]);

  const templates: ReportTemplate[] = [
    {
      id: 'executive',
      name: 'Reporte Ejecutivo',
      description: 'Dashboard ejecutivo con métricas clave, tendencias y recomendaciones estratégicas',
      type: 'executive',
      icon: BarChart3,
      color: 'blue',
      features: [
        'Métricas KPI automatizadas',
        'Gráficos interactivos generados por IA',
        'Resumen ejecutivo inteligente',
        'Recomendaciones estratégicas',
        'Branding corporativo'
      ],
      estimated_time: '3-5 min'
    },
    {
      id: 'campaign',
      name: 'Análisis de Campaña', 
      description: 'Evaluación completa de performance de campañas con insights predictivos',
      type: 'marketing',
      icon: Target,
      color: 'green',
      features: [
        'ROI y performance metrics',
        'Análisis de segmentación',
        'Comparativas vs competencia',
        'Predicciones ML integradas',
        'Visualizaciones personalizadas'
      ],
      estimated_time: '2-4 min'
    },
    {
      id: 'focus_group',
      name: 'Focus Group Insights',
      description: 'Resumen visual de sesiones de focus group con análisis de sentiment',
      type: 'technical',
      icon: Users,
      color: 'purple',
      features: [
        'Transcripciones analizadas',
        'Mapas de sentiment',
        'Word clouds dinámicos', 
        'Insights por participante',
        'Recomendaciones accionables'
      ],
      estimated_time: '1-3 min'
    }
  ];

  const dataSources = [
    { id: 'last_7_days', label: 'Últimos 7 días' },
    { id: 'last_30_days', label: 'Últimos 30 días' },
    { id: 'last_quarter', label: 'Último trimestre' },
    { id: 'last_year', label: 'Último año' },
    { id: 'custom_range', label: 'Rango personalizado' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setReportConfig({...reportConfig, template_id: templateId});
  };

  const handleGenerate = async () => {
    if (!reportConfig.template_id || !reportConfig.title) {
      alert('Por favor selecciona una plantilla y proporciona un título');
      return;
    }

    setIsGenerating(true);

    // Simular generación con DALL-E 3 y Azure Functions
    setTimeout(() => {
      alert('¡Reporte generado exitosamente! Esta funcionalidad se completará con DALL-E 3 próximamente.');
      setIsGenerating(false);
    }, 4000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Reportes Automáticos
                </h1>
                <p className="text-sm text-gray-600">
                  Generación inteligente con DALL-E 3 y Azure Functions
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Templates Section */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Plantillas de Reportes
            </h2>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={cn(
                    "bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedTemplate === template.id 
                      ? "border-teal-500 ring-2 ring-teal-200" 
                      : "border-gray-200 hover:border-teal-300"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                    template.color === 'blue' && "bg-blue-100",
                    template.color === 'green' && "bg-green-100", 
                    template.color === 'purple' && "bg-purple-100"
                  )}>
                    <template.icon className={cn(
                      "h-6 w-6",
                      template.color === 'blue' && "text-blue-600",
                      template.color === 'green' && "text-green-600",
                      template.color === 'purple' && "text-purple-600"
                    )} />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.estimated_time}
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {template.type}
                    </span>
                  </div>
                  
                  <ul className="space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Configuration */}
            {selectedTemplate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-teal-600" />
                  Configuración del Reporte
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Reporte
                    </label>
                    <input
                      type="text"
                      value={reportConfig.title}
                      onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})}
                      placeholder="Ej: Análisis Q1 2025 - Tigo Honduras"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuente de Datos
                    </label>
                    <select
                      value={reportConfig.data_source}
                      onChange={(e) => setReportConfig({...reportConfig, data_source: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      {dataSources.map(source => (
                        <option key={source.id} value={source.id}>{source.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={reportConfig.language}
                      onChange={(e) => setReportConfig({...reportConfig, language: e.target.value as 'spanish' | 'english'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="spanish">Español</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato
                    </label>
                    <select
                      value={reportConfig.format}
                      onChange={(e) => setReportConfig({...reportConfig, format: e.target.value as 'pdf' | 'pptx' | 'html'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="pptx">PowerPoint</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Opciones Avanzadas
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.include_charts}
                        onChange={(e) => setReportConfig({...reportConfig, include_charts: e.target.checked})}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Incluir gráficos generados por IA
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.include_infographics}
                        onChange={(e) => setReportConfig({...reportConfig, include_infographics: e.target.checked})}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Generar infografías con DALL-E 3
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reportConfig.brand_colors}
                        onChange={(e) => setReportConfig({...reportConfig, brand_colors: e.target.checked})}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Aplicar branding de Tigo
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !reportConfig.title}
                  className={cn(
                    "w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                    isGenerating || !reportConfig.title 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:shadow-lg"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Generando con DALL-E 3...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generar Reporte
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Recent Reports Sidebar */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Reportes Recientes
            </h2>
            
            <div className="space-y-3">
              {generatedReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {report.title}
                    </h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Completado
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.created_at)}
                  </div>
                  
                  <button 
                    onClick={() => alert('Descarga próximamente disponible')}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                  >
                    <Download className="h-3 w-3" />
                    Descargar
                  </button>
                </div>
              ))}
            </div>

            {/* DALL-E 3 Info */}
            <div className="mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Powered by DALL-E 3
              </h3>
              <p className="text-teal-100 text-sm">
                Generación automática de visualizaciones profesionales e infografías usando la IA más avanzada de OpenAI.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsModule;