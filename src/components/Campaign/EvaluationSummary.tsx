// components/Campaign/EvaluationSummary.tsx - Resumen Ejecutivo de Evaluación

import React from 'react';
import { 
  AlertTriangle, CheckCircle, 
  XCircle, Target, DollarSign, Users, MessageSquare,
  BarChart3, Lightbulb, AlertCircle
} from 'lucide-react';
import type { SegmentReaction } from '../../types/campaign.types';

interface EvaluationSummaryProps {
  concept: any;
  reactions: SegmentReaction[];
  onOpenChat?: (archetype: string, context: any) => void;
}

const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({ 
  concept, 
  reactions,
  onOpenChat 
}) => {
  // Calcular métricas agregadas
  const calculateMetrics = () => {
    const scores = reactions.map(r => r.overall_score);
    const variableScores: Record<string, number[]> = {};
    
    reactions.forEach(reaction => {
      Object.entries(reaction.variable_reactions).forEach(([variable, data]) => {
        if (!variableScores[variable]) variableScores[variable] = [];
        variableScores[variable].push(data.score);
      });
    });

    const avgVariableScores = Object.entries(variableScores).map(([variable, scores]) => ({
      variable,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores)
    })).sort((a, b) => b.avgScore - a.avgScore);

    return {
      overallAverage: scores.reduce((a, b) => a + b, 0) / scores.length,
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      variableRanking: avgVariableScores,
      consensusLevel: calculateConsensus(scores)
    };
  };

  const calculateConsensus = (scores: number[]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev < 10) return 'Alto';
    if (stdDev < 20) return 'Moderado';
    return 'Bajo';
  };

  const metrics = calculateMetrics();
  
  // Determinar veredicto
  const getVerdict = () => {
    const avg = metrics.overallAverage;
    if (avg >= 75) return { text: 'LISTO PARA LANZAR', color: 'green', icon: CheckCircle };
    if (avg >= 60) return { text: 'REQUIERE AJUSTES MENORES', color: 'yellow', icon: AlertTriangle };
    if (avg >= 40) return { text: 'REQUIERE AJUSTES MAYORES', color: 'orange', icon: AlertCircle };
    return { text: 'NO RECOMENDADO', color: 'red', icon: XCircle };
  };

  const verdict = getVerdict();

  // Identificar problemas críticos
  const criticalIssues = metrics.variableRanking
    .filter(v => v.avgScore < 40)
    .map(v => ({
      variable: v.variable,
      score: v.avgScore,
      impact: v.variable === 'price' ? 'CRÍTICO' : 
              v.variable === 'name' || v.variable === 'benefits' ? 'ALTO' : 'MEDIO'
    }));

  // Extraer insights principales
  const topInsights = reactions
    .flatMap(r => r.key_insights)
    .filter((insight, index, self) => self.indexOf(insight) === index)
    .slice(0, 5);

  // Consolidar preocupaciones únicas
  const consolidatedConcerns = [...new Set(reactions.flatMap(r => r.concerns))];
  
  // Priorizar sugerencias
  const prioritizedSuggestions = [...new Set(reactions.flatMap(r => r.suggestions))]
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header con Veredicto */}
      <div className={`bg-gradient-to-r ${
        verdict.color === 'green' ? 'from-green-500 to-green-600' :
        verdict.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
        verdict.color === 'orange' ? 'from-orange-500 to-orange-600' :
        'from-red-500 to-red-600'
      } rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Resumen Ejecutivo</h2>
            <div className="flex items-center gap-3">
              <verdict.icon className="h-8 w-8" />
              <span className="text-3xl font-bold">{verdict.text}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{Math.round(metrics.overallAverage)}</div>
            <div className="text-sm opacity-90">Score Promedio</div>
            <div className="text-xs mt-1 opacity-75">
              Min: {Math.round(metrics.minScore)} | Max: {Math.round(metrics.maxScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-gray-500">Consenso</span>
          </div>
          <div className="text-2xl font-bold">{metrics.consensusLevel}</div>
          <div className="text-xs text-gray-600">entre arquetipos</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-xs text-gray-500">Arquetipos</span>
          </div>
          <div className="text-2xl font-bold">{reactions.length}</div>
          <div className="text-xs text-gray-600">evaluados</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-500">Precio</span>
          </div>
          <div className="text-2xl font-bold">L{concept.monthly_price}</div>
          <div className="text-xs text-red-600">
            Score: {Math.round(metrics.variableRanking.find(v => v.variable === 'price')?.avgScore || 0)}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-xs text-gray-500">Issues</span>
          </div>
          <div className="text-2xl font-bold">{criticalIssues.length}</div>
          <div className="text-xs text-gray-600">críticos</div>
        </div>
      </div>

      {/* Análisis por Variable */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Desempeño por Variable
        </h3>
        <div className="space-y-3">
          {metrics.variableRanking.map(({ variable, avgScore, min, max }) => (
            <div key={variable} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">
                  {variable.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {Math.round(avgScore)}
                  </span>
                  {avgScore < 40 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      CRÍTICO
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full transition-all ${
                    avgScore >= 70 ? 'bg-green-500' :
                    avgScore >= 50 ? 'bg-yellow-500' :
                    avgScore >= 30 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${avgScore}%` }}
                />
                {/* Rango min-max */}
                <div 
                  className="absolute top-0 h-full bg-black bg-opacity-20"
                  style={{ 
                    left: `${min}%`, 
                    width: `${max - min}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problemas Críticos */}
      {criticalIssues.length > 0 && (
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
            <XCircle className="h-5 w-5" />
            Problemas Críticos Identificados
          </h3>
          <div className="space-y-3">
            {criticalIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`px-2 py-1 rounded text-xs font-bold text-white ${
                  issue.impact === 'CRÍTICO' ? 'bg-red-600' :
                  issue.impact === 'ALTO' ? 'bg-orange-600' :
                  'bg-yellow-600'
                }`}>
                  {issue.impact}
                </div>
                <div className="flex-1">
                  <div className="font-medium capitalize">
                    {issue.variable.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    Score promedio: {Math.round(issue.score)}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Clave */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <Lightbulb className="h-5 w-5" />
          Insights Clave
        </h3>
        <ul className="space-y-2">
          {topInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preocupaciones Consolidadas */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          Preocupaciones Principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {consolidatedConcerns.slice(0, 6).map((concern, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0" />
              <span className="text-sm">{concern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan de Acción */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Plan de Acción Recomendado
        </h3>
        <div className="space-y-3">
          {prioritizedSuggestions.map((suggestion, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <span className="text-sm">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Imprimir Resumen
        </button>
        <button
          onClick={() => {
            // Exportar resumen como PDF o JSON
            const summaryData = {
              concept,
              metrics,
              verdict: verdict.text,
              criticalIssues,
              insights: topInsights,
              concerns: consolidatedConcerns,
              suggestions: prioritizedSuggestions,
              reactions
            };
            
            const dataStr = JSON.stringify(summaryData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', `resumen-ejecutivo-${Date.now()}.json`);
            linkElement.click();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Exportar Resumen
        </button>
      </div>

      {/* Entrevistas Profundas */}
      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
          <MessageSquare className="h-5 w-5" />
          Entrevistas en Profundidad
        </h3>
        <p className="text-sm text-indigo-600 mb-4">
          Conversa directamente con cada arquetipo como si fuera una entrevista real. 
          Cada persona mantiene su contexto, personalidad y evaluación previa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.archetype}
              onClick={() => onOpenChat?.(reaction.archetype, reaction)}
              className="p-4 bg-white rounded-lg border border-indigo-300 hover:bg-indigo-50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <span className="text-sm font-medium text-indigo-700">
                      {reaction.persona_context?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">{reaction.archetype}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  reaction.overall_score >= 70 ? 'bg-green-100 text-green-700' :
                  reaction.overall_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {reaction.overall_score}/100
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {reaction.persona_context?.name} • {reaction.persona_context?.age} años
              </div>
              <div className="text-sm text-gray-500">
                {reaction.persona_context?.occupation} • {reaction.persona_context?.city}
              </div>
              <div className="text-xs text-indigo-600 mt-3 flex items-center justify-between">
                <span>💬 Iniciar entrevista</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;