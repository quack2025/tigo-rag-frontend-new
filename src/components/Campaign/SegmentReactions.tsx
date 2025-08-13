// components/Campaign/SegmentReactions.tsx - Muestra reacciones detalladas por segmento

import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle, 
  MessageCircle, Lightbulb, ThumbsUp, ThumbsDown, Star,
  BarChart3, Eye, ArrowRight, Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SegmentReaction, CampaignConcept, EvaluationVariable } from '../../types/campaign.types';
import { EVALUATION_VARIABLES } from '../../types/campaign.types';
import { TigoArchetype } from '../../types/persona.types';

interface SegmentReactionsProps {
  concept: CampaignConcept;
  reactions: SegmentReaction[];
  selectedArchetype?: string;
  onSelectArchetype?: (archetype: string) => void;
  onOpenInterview?: (archetype: string, context: SegmentReaction) => void;
}

const SegmentReactions: React.FC<SegmentReactionsProps> = ({ 
  concept, 
  reactions, 
  selectedArchetype,
  onSelectArchetype,
  onOpenInterview 
}) => {
  const [selectedVariable, setSelectedVariable] = useState<EvaluationVariable>('name');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Mapeo de arquetipos a nombres y colores
  const archetypeInfo = {
    [TigoArchetype.PROFESIONAL]: { name: 'Profesional', color: 'blue', icon: '💼' },
    [TigoArchetype.CONTROLADOR]: { name: 'Controlador', color: 'green', icon: '📊' },
    [TigoArchetype.EMPRENDEDOR]: { name: 'Emprendedor', color: 'orange', icon: '🚀' },
    [TigoArchetype.GOMOSO_EXPLORADOR]: { name: 'Gomoso/Explorador', color: 'purple', icon: '🎨' },
    [TigoArchetype.PRAGMATICO]: { name: 'Pragmático', color: 'yellow', icon: '⚡' },
    [TigoArchetype.RESIGNADO]: { name: 'Resignado', color: 'gray', icon: '🌾' }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'muy_positivo': return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'positivo': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'neutral': return <Eye className="h-4 w-4 text-gray-500" />;
      case 'negativo': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'muy_negativo': return <ThumbsDown className="h-4 w-4 text-red-600" />;
      default: return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'muy_positivo': return 'text-green-700 bg-green-50 border-green-200';
      case 'positivo': return 'text-green-600 bg-green-50 border-green-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'negativo': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'muy_negativo': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    if (score >= 20) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const selectedReaction = reactions.find(r => r.archetype === selectedArchetype);

  return (
    <div className="space-y-6">
      {/* Header con información del concepto */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {concept.type === 'campaign' ? <MessageCircle className="h-5 w-5" /> : <Star className="h-5 w-5" />}
              <span className="text-sm font-medium opacity-90">
                {concept.type === 'campaign' ? 'Campaña de Comunicación' : 'Concepto de Producto'}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{concept.name}</h2>
            <p className="text-emerald-100 text-sm max-w-2xl">{concept.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Precio</div>
            <div className="text-xl font-bold">
              {concept.monthly_price ? `L ${concept.monthly_price.toLocaleString()}` : 'Por definir'}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle de vista */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Reacciones por Segmento ({reactions.length} evaluaciones)
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'detailed', label: 'Detallado', icon: Eye }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id as any)}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                viewMode === view.id
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <view.icon className="h-4 w-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'overview' ? (
        /* Vista Resumen - Todos los segmentos */
        <div className="grid gap-4">
          {reactions.map((reaction) => {
            const info = archetypeInfo[reaction.archetype as keyof typeof archetypeInfo];
            
            return (
              <div 
                key={reaction.archetype}
                className={cn(
                  "bg-white border-2 rounded-xl p-6 transition-all cursor-pointer group",
                  selectedArchetype === reaction.archetype
                    ? "border-emerald-500 shadow-lg ring-2 ring-emerald-500/20"
                    : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                )}
                onClick={() => {
                  onSelectArchetype?.(reaction.archetype);
                  setViewMode('detailed');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{info?.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{info?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {reaction.persona_context.name} • {reaction.persona_context.age} años • {reaction.persona_context.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2", 
                        getSentimentColor(reaction.overall_sentiment))}>
                        {getSentimentIcon(reaction.overall_sentiment)}
                        {reaction.overall_sentiment.replace('_', ' ')}
                      </div>
                      <div className={cn("text-2xl font-bold mt-1", getScoreColor(reaction.overall_score))}>
                        {reaction.overall_score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-emerald-100 transition-colors">
                      <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Mini vista de variables */}
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(reaction.variable_reactions).slice(0, 5).map(([variable, varReaction]) => (
                    <div key={variable} className="text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {EVALUATION_VARIABLES[variable as EvaluationVariable]?.label}
                      </div>
                      <div className={cn("text-lg font-bold", getScoreColor(varReaction.score))}>
                        {varReaction.score}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insights rápidos */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">Adopción:</span>
                      <span className="font-medium">{reaction.likelihood_to_adopt}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-gray-600">Recomendación:</span>
                      <span className="font-medium">{reaction.likelihood_to_recommend}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-600">Insights:</span>
                      <span className="font-medium">{reaction.key_insights.length}</span>
                    </div>
                  </div>
                    <span className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Clic para ver detalle →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vista Detallada - Un segmento */
        <div className="space-y-6">
          {/* Selector de segmentos */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Selecciona un segmento</h4>
              <button
                onClick={() => setViewMode('overview')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ← Volver al resumen
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {reactions.map((reaction) => {
                const info = archetypeInfo[reaction.archetype as keyof typeof archetypeInfo];
                return (
                  <button
                    key={reaction.archetype}
                    onClick={() => onSelectArchetype?.(reaction.archetype)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2",
                      selectedArchetype === reaction.archetype
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                  >
                    <span className="text-lg">{info?.icon}</span>
                    <span>{info?.name}</span>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold", 
                      getScoreColor(reaction.overall_score))}>
                      {reaction.overall_score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedReaction ? (
          <div className="space-y-6">
            {/* Header del segmento seleccionado */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{archetypeInfo[selectedReaction.archetype as keyof typeof archetypeInfo]?.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {archetypeInfo[selectedReaction.archetype as keyof typeof archetypeInfo]?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedReaction.persona_context.name} • {selectedReaction.persona_context.city}
                    </p>
                  </div>
                </div>
                
                {onOpenInterview && (
                  <button
                    onClick={() => onOpenInterview(selectedReaction.archetype, selectedReaction)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all font-medium text-sm"
                  >
                    🎤 Entrevistar
                  </button>
                )}
              </div>
            </div>

            {/* Selector de variables */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Variables de Evaluación</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(EVALUATION_VARIABLES).map(([key, variable]) => {
                  const reaction = selectedReaction.variable_reactions[key as EvaluationVariable];
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedVariable(key as EvaluationVariable)}
                      className={cn(
                        "p-3 rounded-lg border-2 text-sm transition-all",
                        selectedVariable === key
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="font-medium">{variable.label}</div>
                      <div className={cn("text-xs font-bold mt-1", getScoreColor(reaction.score))}>
                        {reaction.score}/100
                      </div>
                      <div className="mt-1">
                        {getSentimentIcon(reaction.sentiment)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalle de la variable seleccionada */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {EVALUATION_VARIABLES[selectedVariable].label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {EVALUATION_VARIABLES[selectedVariable].description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-3xl font-bold", 
                      getScoreColor(selectedReaction.variable_reactions[selectedVariable].score))}>
                      {selectedReaction.variable_reactions[selectedVariable].score}/100
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 mt-2",
                      getSentimentColor(selectedReaction.variable_reactions[selectedVariable].sentiment))}>
                      {getSentimentIcon(selectedReaction.variable_reactions[selectedVariable].sentiment)}
                      {selectedReaction.variable_reactions[selectedVariable].sentiment.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Reacción textual */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Reacción inmediata
                  </h5>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
                    <p className="text-gray-700 italic">
                      "{selectedReaction.variable_reactions[selectedVariable].reaction_text}"
                    </p>
                  </div>
                </div>

                {/* Feedback específico */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Análisis detallado
                  </h5>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReaction.variable_reactions[selectedVariable].specific_feedback}
                  </p>
                </div>

                {/* Sugerencia de mejora */}
                {selectedReaction.variable_reactions[selectedVariable].improvement_suggestion && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      Sugerencia de mejora
                    </h5>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        {selectedReaction.variable_reactions[selectedVariable].improvement_suggestion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insights generales del segmento */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Puntos Fuertes
                </h5>
                <ul className="space-y-2">
                  {selectedReaction.key_insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  Preocupaciones
                </h5>
                <ul className="space-y-2">
                  {selectedReaction.concerns.map((concern, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          ) : (
            /* Mensaje cuando no hay segmento seleccionado */
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un segmento para ver el detalle
              </h3>
              <p className="text-sm text-gray-600">
                Haz clic en cualquiera de los segmentos arriba para ver sus reacciones detalladas por variable
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SegmentReactions;