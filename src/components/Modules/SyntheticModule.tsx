// components/Modules/SyntheticModule.tsx - Módulo de Evaluación de Campañas y Conceptos

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Download, Settings, Lightbulb, 
  BarChart3, Target, Zap, CheckCircle, History, Play
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';
import ConceptForm from '../Campaign/ConceptForm';
import ArchetypeSelector from '../Campaign/ArchetypeSelector';
import SegmentReactions from '../Campaign/SegmentReactions';
import PersonaSettings from '../Campaign/PersonaSettings';
import FocusGroupSimulator from '../Personas/FocusGroupSimulator';
import EvaluationSummary from '../Campaign/EvaluationSummary';
import HumanArchetypeChat from '../Campaign/HumanArchetypeChat';
import { CampaignEvaluator } from '../../utils/campaignEvaluator';
import type { CampaignConcept, EvaluationSession, SegmentReaction } from '../../types/campaign.types';
import type { SyntheticPersona } from '../../types/persona.types';
import { TigoArchetype } from '../../types/persona.types';

type ViewState = 'welcome' | 'concept_form' | 'archetype_selector' | 'evaluating' | 'results';

const SyntheticModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  
  // Estado principal
  const [currentView, setCurrentView] = useState<ViewState>('welcome');
  const [currentConcept, setCurrentConcept] = useState<CampaignConcept | null>(null);
  const [currentSession, setCurrentSession] = useState<EvaluationSession | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [evaluationSessions, setEvaluationSessions] = useState<EvaluationSession[]>([]);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showFocusGroup, setShowFocusGroup] = useState(false);
  const [focusGroupPersonas, setFocusGroupPersonas] = useState<SyntheticPersona[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showInterviews, setShowInterviews] = useState(false);
  const [showDeepChat, setShowDeepChat] = useState(false);
  const [selectedChatArchetype, setSelectedChatArchetype] = useState<string>('');
  const [selectedChatContext, setSelectedChatContext] = useState<any>(null);
  
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate, isAuthenticated]);

  // Load evaluation history on mount
  useEffect(() => {
    loadEvaluationHistory();
  }, []);

  const loadEvaluationHistory = () => {
    const saved = localStorage.getItem('tigo_campaign_evaluations');
    if (saved) {
      const sessions = JSON.parse(saved).map((session: any) => ({
        ...session,
        created_at: new Date(session.created_at)
      }));
      setEvaluationSessions(sessions);
    }
  };

  const saveEvaluationSession = (session: EvaluationSession) => {
    const updatedSessions = [...evaluationSessions, session];
    setEvaluationSessions(updatedSessions);
    localStorage.setItem('tigo_campaign_evaluations', JSON.stringify(updatedSessions));
  };

  const handleConceptSave = (concept: CampaignConcept) => {
    setCurrentConcept(concept);
    setCurrentView('archetype_selector');
  };

  const handleStartEvaluation = async (selectedArchetypes: string[]) => {
    if (!currentConcept) return;

    setCurrentView('evaluating');
    setEvaluationProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setEvaluationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Generar evaluaciones
      const reactions = await CampaignEvaluator.evaluateConcept(currentConcept, selectedArchetypes);
      
      clearInterval(progressInterval);
      setEvaluationProgress(100);

      // Crear sesión de evaluación
      const session: EvaluationSession = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        concept: currentConcept,
        selected_archetypes: selectedArchetypes,
        reactions,
        summary: generateSummary(reactions),
        created_at: new Date(),
        status: 'completed'
      };

      setCurrentSession(session);
      saveEvaluationSession(session);
      
      // Seleccionar primer arquetipo por defecto
      if (reactions.length > 0) {
        setSelectedArchetype(reactions[0].archetype);
      }

      setTimeout(() => {
        setCurrentView('results');
      }, 1000);

    } catch (error) {
      console.error('Error en evaluación:', error);
      setCurrentView('archetype_selector');
    }
  };

  const generateSummary = (reactions: SegmentReaction[]) => {
    const avgScore = Math.round(
      reactions.reduce((sum, r) => sum + r.overall_score, 0) / reactions.length
    );

    // Encontrar variable con mejor/peor performance
    const allVariableScores: Record<string, number[]> = {};
    reactions.forEach(reaction => {
      Object.entries(reaction.variable_reactions).forEach(([variable, varReaction]) => {
        if (!allVariableScores[variable]) allVariableScores[variable] = [];
        allVariableScores[variable].push(varReaction.score);
      });
    });

    const variableAverages = Object.entries(allVariableScores).map(([variable, scores]) => ({
      variable,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
    })).sort((a, b) => b.avgScore - a.avgScore);

    // Recopilar insights más comunes
    const allConcerns = reactions.flatMap(r => r.concerns);
    const allSuggestions = reactions.flatMap(r => r.suggestions);
    
    const topConcerns = [...new Set(allConcerns)].slice(0, 3);
    const topSuggestions = [...new Set(allSuggestions)].slice(0, 3);

    return {
      average_score: avgScore,
      best_performing_variable: variableAverages[0]?.variable || 'name',
      worst_performing_variable: variableAverages[variableAverages.length - 1]?.variable || 'price',
      top_concerns: topConcerns,
      top_suggestions: topSuggestions
    };
  };

  const exportEvaluation = () => {
    if (!currentSession) return;

    const data = {
      module: 'campaign_evaluation',
      exported_at: new Date().toISOString(),
      user: user?.username,
      session: currentSession
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacion-${currentSession.concept.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToWelcome = () => {
    setCurrentView('welcome');
    setCurrentConcept(null);
    setCurrentSession(null);
    setSelectedArchetype(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Evaluación de Campañas
                </h1>
                <p className="text-sm text-gray-500">
                  Valida conceptos con arquetipos hondureños • {user?.username || 'Usuario'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentSession && (
              <button
                onClick={exportEvaluation}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Exportar evaluación"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => {
                console.log('🎯 Focus Group button clicked', { hasSession: !!currentSession, reactionsCount: currentSession?.reactions?.length });
                if (currentSession) {
                  // Usar los arquetipos de la evaluación actual
                  const focusGroupPersonas = currentSession.reactions.map(reaction => ({
                    id: reaction.archetype,
                    name: reaction.persona_context.name,
                    age: reaction.persona_context.age,
                    location: reaction.persona_context.city,
                    segment: reaction.archetype,
                    personality_traits: [reaction.persona_context.personality],
                    evaluation_context: reaction, // Incluir contexto de evaluación
                    concept: currentSession.concept // Incluir el concepto evaluado
                  }));
                  console.log('👥 Setting focus group personas:', focusGroupPersonas.length, focusGroupPersonas);
                  setFocusGroupPersonas(focusGroupPersonas);
                  console.log('🎭 Opening focus group modal');
                  setShowFocusGroup(true);
                } else {
                  alert('Primero realiza una evaluación para generar el focus group');
                }
              }}
              className="px-3 py-2 text-purple-600 hover:text-purple-800 border border-purple-300 rounded-lg hover:bg-purple-50"
              title="Focus Group sobre concepto evaluado"
              disabled={!currentSession}
            >
              <Play className="h-4 w-4 inline mr-2" />
              Focus Group
            </button>

            <button
              onClick={resetToWelcome}
              className="px-3 py-2 text-emerald-600 hover:text-emerald-800 border border-emerald-300 rounded-lg hover:bg-emerald-50"
              title="Nueva evaluación"
            >
              <Lightbulb className="h-4 w-4 inline mr-2" />
              Nueva Evaluación
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Configuración del módulo"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Welcome View */}
        {currentView === 'welcome' && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="h-16 w-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Evaluación de Campañas y Conceptos
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Valida tus ideas con 6 arquetipos hondureños realistas. Obtén reacciones detalladas, 
              insights específicos y recomendaciones de mejora para cada segmento.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: Lightbulb,
                  title: 'Conceptos de Producto',
                  description: 'Evalúa nuevos servicios, planes y productos antes del lanzamiento',
                  examples: ['Tigo 5G Pro', 'Plan Familia Plus', 'Tigo Business']
                },
                {
                  icon: BarChart3,
                  title: 'Campañas de Comunicación',
                  description: 'Valida mensajes, tonos y enfoques de marketing',
                  examples: ['Tigo Más Cerca', 'Honduras Digital', 'Conecta tu Futuro']
                },
                {
                  icon: Zap,
                  title: 'Insights Accionables',
                  description: 'Reacciones específicas por arquetipo con sugerencias de mejora',
                  examples: ['Puntos fuertes', 'Preocupaciones', 'Oportunidades']
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 transition-colors">
                  <item.icon className="h-8 w-8 text-emerald-600 mb-4 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <div className="space-y-1">
                    {item.examples.map((example, i) => (
                      <span key={i} className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded mr-1">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('concept_form')}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg text-lg font-medium"
            >
              Comenzar Nueva Evaluación
            </button>

            {/* Historial reciente */}
            {evaluationSessions.length > 0 && (
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Evaluaciones Recientes</h3>
                </div>
                <div className="grid gap-3">
                  {evaluationSessions.slice(-3).reverse().map((session) => (
                    <div 
                      key={session.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-emerald-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setCurrentSession(session);
                        setCurrentConcept(session.concept);
                        setSelectedArchetype(session.reactions[0]?.archetype || null);
                        setCurrentView('results');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            session.concept.type === 'campaign' 
                              ? "bg-purple-100" : "bg-blue-100"
                          )}>
                            {session.concept.type === 'campaign' ? 
                              <BarChart3 className="h-5 w-5 text-purple-600" /> :
                              <Target className="h-5 w-5 text-blue-600" />
                            }
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-900">{session.concept.name}</h4>
                            <p className="text-sm text-gray-600">
                              {session.selected_archetypes.length} arquetipos • Score promedio: {session.summary.average_score}/100
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                          <p className="text-xs text-gray-500">
                            {session.created_at.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Concept Form */}
        {currentView === 'concept_form' && (
          <ConceptForm
            onSave={handleConceptSave}
            onCancel={() => setCurrentView('welcome')}
          />
        )}

        {/* Archetype Selector */}
        {currentView === 'archetype_selector' && currentConcept && (
          <ArchetypeSelector
            concept={currentConcept}
            onStartEvaluation={handleStartEvaluation}
            onBack={() => setCurrentView('concept_form')}
          />
        )}

        {/* Evaluating */}
        {currentView === 'evaluating' && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="h-16 w-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Evaluando con Arquetipos Hondureños
            </h2>
            <p className="text-gray-600 mb-8">
              Nuestros arquetipos están analizando "{currentConcept?.name}" desde sus perspectivas únicas...
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${evaluationProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {evaluationProgress < 100 ? `${Math.round(evaluationProgress)}% completado` : 'Finalizando evaluación...'}
            </p>
          </div>
        )}

        {/* Toggle para Resumen vs Detalle */}
        {currentView === 'results' && currentSession && (
          <div className="mb-6 flex justify-center">
            <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
              {[
                { id: 'detailed', label: 'Vista Detallada', icon: '🔍' },
                { id: 'summary', label: 'Resumen Ejecutivo', icon: '📊' },
                { id: 'interviews', label: 'Entrevistas', icon: '🎤' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setShowSummary(tab.id === 'summary');
                    setShowInterviews(tab.id === 'interviews');
                    if (tab.id === 'interviews') {
                      setSelectedArchetype(null); // Clear archetype selection for interviews view
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                    (tab.id === 'summary' && showSummary) ||
                    (tab.id === 'detailed' && !showSummary && !showInterviews) ||
                    (tab.id === 'interviews' && showInterviews)
                      ? 'bg-white text-emerald-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mostrar Resumen o Resultados Detallados */}
        {currentView === 'results' && currentSession && showSummary && (
          <EvaluationSummary
            concept={currentConcept}
            reactions={currentSession.reactions}
            onOpenChat={(archetype, context) => {
              setSelectedChatArchetype(archetype);
              setSelectedChatContext(context);
              setShowDeepChat(true);
            }}
          />
        )}

        {/* Vista de Entrevistas */}
        {currentView === 'results' && currentSession && showInterviews && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    🎤 Entrevistas en Profundidad
                  </h2>
                  <p className="text-indigo-100">
                    Conversa directamente con cada arquetipo como si fuera una entrevista real. 
                    Cada persona mantiene su contexto, personalidad y evaluación previa del concepto.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {currentSession.reactions.map((reaction) => {
                const info = {
                  [TigoArchetype.PROFESIONAL]: { name: 'Profesional', color: 'blue', icon: '💼', bg: 'from-blue-500 to-blue-600' },
                  [TigoArchetype.CONTROLADOR]: { name: 'Controlador', color: 'green', icon: '📊', bg: 'from-green-500 to-green-600' },
                  [TigoArchetype.EMPRENDEDOR]: { name: 'Emprendedor', color: 'orange', icon: '🚀', bg: 'from-orange-500 to-orange-600' },
                  [TigoArchetype.GOMOSO_EXPLORADOR]: { name: 'Gomoso/Explorador', color: 'purple', icon: '🎨', bg: 'from-purple-500 to-purple-600' },
                  [TigoArchetype.PRAGMATICO]: { name: 'Pragmático', color: 'yellow', icon: '⚡', bg: 'from-yellow-500 to-yellow-600' },
                  [TigoArchetype.RESIGNADO]: { name: 'Resignado', color: 'gray', icon: '🌾', bg: 'from-gray-500 to-gray-600' }
                }[reaction.archetype as keyof typeof TigoArchetype] || { name: 'Unknown', color: 'gray', icon: '👤', bg: 'from-gray-500 to-gray-600' };

                return (
                  <div key={reaction.archetype} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Header with archetype info */}
                    <div className={`bg-gradient-to-r ${info.bg} p-4 text-white`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h3 className="text-lg font-semibold">{info.name}</h3>
                          <p className="text-sm opacity-90">
                            {reaction.persona_context.name} • {reaction.persona_context.age} años • {reaction.persona_context.city}
                          </p>
                        </div>
                      </div>
                      
                      {/* Quick stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>Score:</span>
                          <span className="font-bold">{reaction.overall_score}/100</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Sentiment:</span>
                          <span className="font-medium capitalize">{reaction.overall_sentiment.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Reacción inicial al concepto:</h4>
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400">
                          "{reaction.key_insights[0] || 'Me parece interesante este concepto...'}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">{reaction.likelihood_to_adopt}%</div>
                          <div className="text-xs text-green-600">Probabilidad de adopción</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-700">{reaction.likelihood_to_recommend}%</div>
                          <div className="text-xs text-blue-600">Probabilidad de recomendación</div>
                        </div>
                      </div>

                      {/* Interview button */}
                      <button
                        onClick={() => {
                          setSelectedChatArchetype(reaction.archetype);
                          setSelectedChatContext(reaction);
                          setShowDeepChat(true);
                        }}
                        className={`w-full bg-gradient-to-r ${info.bg} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                      >
                        🎤 Iniciar Entrevista
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Detallados (Vista Original) */}
        {currentView === 'results' && currentSession && !showSummary && !showInterviews && (
          <SegmentReactions
            concept={currentSession.concept}
            reactions={currentSession.reactions}
            selectedArchetype={selectedArchetype || undefined}
            onSelectArchetype={setSelectedArchetype}
            onOpenInterview={(archetype, context) => {
              setSelectedChatArchetype(archetype);
              setSelectedChatContext(context);
              setShowDeepChat(true);
            }}
          />
        )}
      </div>

      {/* Settings Modal */}
      <PersonaSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => {
          // Recargar las sesiones si es necesario
          loadEvaluationHistory();
        }}
      />

      {/* Focus Group Modal */}
      <FocusGroupSimulator
        isOpen={showFocusGroup}
        onClose={() => setShowFocusGroup(false)}
        personas={focusGroupPersonas}
      />

      {/* Chat Humano con Arquetipo */}
      <HumanArchetypeChat
        isOpen={showDeepChat}
        onClose={() => setShowDeepChat(false)}
        archetype={selectedChatArchetype}
        evaluationContext={selectedChatContext}
        conceptDetails={currentConcept}
      />
    </div>
  );
};

export default SyntheticModule;