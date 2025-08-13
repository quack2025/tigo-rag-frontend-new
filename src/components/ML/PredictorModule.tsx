// components/ML/PredictorModule.tsx - Predictor ML de Éxito de Campañas

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Lightbulb,
  Play,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface CampaignInput {
  name: string;
  type: 'product' | 'campaign';
  target_segment: string;
  monthly_price?: number;
  channel: string;
  tone: string;
  benefits: string;
  differentiation: string;
}

interface Prediction {
  success_probability: number;
  risk_level: 'low' | 'medium' | 'high';
  key_strengths: string[];
  key_risks: string[];
  recommendations: string[];
  segment_analysis: {
    [segment: string]: {
      adoption_probability: number;
      sentiment: 'positive' | 'neutral' | 'negative';
    };
  };
}

const PredictorModule: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignInput>({
    name: '',
    type: 'campaign',
    target_segment: 'PROFESIONAL',
    channel: 'digital',
    tone: 'profesional',
    benefits: '',
    differentiation: ''
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const segments = [
    'PROFESIONAL',
    'CONTROLADOR', 
    'EMPRENDEDOR',
    'GOMOSO_EXPLORADOR',
    'PRAGMATICO',
    'RESIGNADO'
  ];

  const channels = [
    'digital',
    'tradicional',
    'punto_venta',
    'redes_sociales',
    'radio_tv',
    'outdoor'
  ];

  const tones = [
    'profesional',
    'cercano',
    'innovador',
    'confiable',
    'divertido',
    'aspiracional'
  ];

  const handleAnalyze = async () => {
    if (!campaignData.name || !campaignData.benefits) {
      alert('Por favor completa al menos el nombre y beneficios de la campaña');
      return;
    }

    setIsAnalyzing(true);

    // Simular análisis ML (en producción conectaría con Azure ML)
    setTimeout(() => {
      const mockPrediction: Prediction = {
        success_probability: Math.round(65 + Math.random() * 30), // 65-95%
        risk_level: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        key_strengths: [
          'Diferenciación clara vs competencia',
          'Alineación con segmento objetivo',
          'Propuesta de valor sólida'
        ],
        key_risks: [
          'Precio podría ser elevado para segmento',
          'Canal de distribución limitado',
          'Competencia intensa en categoría'
        ],
        recommendations: [
          'Enfatizar beneficios únicos en comunicación',
          'Considerar pricing estratégico por región',
          'Reforzar presencia en canales digitales',
          'A/B testing en mensajes clave'
        ],
        segment_analysis: {
          PROFESIONAL: { adoption_probability: 78, sentiment: 'positive' },
          CONTROLADOR: { adoption_probability: 45, sentiment: 'neutral' },
          EMPRENDEDOR: { adoption_probability: 82, sentiment: 'positive' },
          GOMOSO_EXPLORADOR: { adoption_probability: 91, sentiment: 'positive' },
          PRAGMATICO: { adoption_probability: 34, sentiment: 'negative' },
          RESIGNADO: { adoption_probability: 23, sentiment: 'negative' }
        }
      };

      setPrediction(mockPrediction);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Predictor ML de Campañas
                </h1>
                <p className="text-sm text-gray-600">
                  Inteligencia artificial predictiva para éxito de campañas
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Datos de la Campaña
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Campaña/Concepto
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  placeholder="Ej: Tigo 5G Pro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={campaignData.type}
                    onChange={(e) => setCampaignData({...campaignData, type: e.target.value as 'product' | 'campaign'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="campaign">Campaña</option>
                    <option value="product">Producto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segmento Principal
                  </label>
                  <select
                    value={campaignData.target_segment}
                    onChange={(e) => setCampaignData({...campaignData, target_segment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {segments.map(segment => (
                      <option key={segment} value={segment}>{segment}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal Principal
                  </label>
                  <select
                    value={campaignData.channel}
                    onChange={(e) => setCampaignData({...campaignData, channel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {channels.map(channel => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tono
                  </label>
                  <select
                    value={campaignData.tone}
                    onChange={(e) => setCampaignData({...campaignData, tone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {tones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              {campaignData.type === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Mensual (L)
                  </label>
                  <input
                    type="number"
                    value={campaignData.monthly_price || ''}
                    onChange={(e) => setCampaignData({...campaignData, monthly_price: Number(e.target.value)})}
                    placeholder="Ej: 1200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficios Principales
                </label>
                <textarea
                  value={campaignData.benefits}
                  onChange={(e) => setCampaignData({...campaignData, benefits: e.target.value})}
                  placeholder="Describe los principales beneficios..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diferenciación vs Competencia
                </label>
                <textarea
                  value={campaignData.differentiation}
                  onChange={(e) => setCampaignData({...campaignData, differentiation: e.target.value})}
                  placeholder="¿Qué hace único este concepto?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  isAnalyzing ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 animate-pulse" />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Analizar con ML
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analizando con Machine Learning...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Procesando datos históricos y patrones de mercado
                  </p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {prediction && !isAnalyzing && (
              <>
                {/* Success Prediction */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Predicción de Éxito
                  </h3>
                  
                  <div className="text-center mb-4">
                    <div className={cn("text-4xl font-bold mb-2", getSuccessColor(prediction.success_probability))}>
                      {prediction.success_probability}%
                    </div>
                    <p className="text-gray-600">Probabilidad de éxito</p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      getRiskColor(prediction.risk_level)
                    )}>
                      Riesgo: {prediction.risk_level === 'low' ? 'Bajo' : prediction.risk_level === 'medium' ? 'Medio' : 'Alto'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                      style={{width: `${prediction.success_probability}%`}}
                    ></div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Análisis Clave
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Fortalezas
                      </h4>
                      <ul className="space-y-1">
                        {prediction.key_strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Riesgos
                      </h4>
                      <ul className="space-y-1">
                        {prediction.key_risks.map((risk, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Recomendaciones
                  </h3>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Segment Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Análisis por Segmento
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(prediction.segment_analysis).map(([segment, data]) => (
                      <div key={segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getSentimentIcon(data.sentiment)}
                          <span className="font-medium text-sm">{segment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{data.adoption_probability}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                              style={{width: `${data.adoption_probability}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Exportar Análisis
                  </h3>
                  <p className="text-indigo-100 text-sm mb-4">
                    Genera reportes ejecutivos con estos insights
                  </p>
                  <button
                    onClick={() => alert('Funcionalidad de exportación próximamente disponible')}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    Generar Reporte PDF
                  </button>
                </div>
              </>
            )}

            {!prediction && !isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Listo para Analizar
                </h3>
                <p className="text-gray-600">
                  Completa los datos de la campaña y obtén predicciones precisas con Machine Learning
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PredictorModule;