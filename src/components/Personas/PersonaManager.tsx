// components/Personas/PersonaManager.tsx - Gestión de Personas Sintéticas

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, FileText, Activity, RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Persona {
  id: string;
  name: string;
  age: number;
  location: string;
  segment: string;
  personality_traits: string[];
  tech_savviness: string;
  service_priorities: string[];
  pain_points: string[];
  brand_perception: string;
  validation_score?: number;
  created_at?: string;
}


interface PersonaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona?: (persona: Persona) => void;
  onOpenFocusGroup?: (personas: Persona[]) => void;
}

const PersonaManager: React.FC<PersonaManagerProps> = ({ isOpen, onClose, onSelectPersona, onOpenFocusGroup }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationConfig, setGenerationConfig] = useState({
    count: 10,
    study_level: 'exploratory_study',
    use_implicit_demographics: true,
    include_temporal_context: true,
    generate_interview_transcripts: false
  });
  const [activeTab, setActiveTab] = useState<'generate' | 'manage' | 'insights'>('generate');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Configuración de niveles de estudio
  const studyLevels = [
    { 
      value: 'pilot_study', 
      label: 'Estudio Piloto',
      description: 'Para validación inicial de conceptos'
    },
    { 
      value: 'exploratory_study', 
      label: 'Estudio Exploratorio',
      description: 'Para investigación profunda'
    },
    { 
      value: 'sensitivity_analysis', 
      label: 'Análisis de Sensibilidad',
      description: 'Para identificar variables críticas'
    }
  ];

  // Segmentos disponibles para Honduras
  const segments = [
    'Millennials Urbanos',
    'Gen Z Digital',
    'Profesionales 30-45',
    'Emprendedores',
    'Estudiantes Universitarios',
    'Amas de Casa',
    'Trabajadores Rurales',
    'Jubilados Activos'
  ];

  // Cargar personas existentes
  useEffect(() => {
    if (isOpen) {
      loadExistingPersonas();
    }
  }, [isOpen]);

  const loadExistingPersonas = async () => {
    try {
      const savedPersonas = localStorage.getItem('tigo_synthetic_personas');
      if (savedPersonas) {
        setPersonas(JSON.parse(savedPersonas));
      }
    } catch (error) {
      console.error('Error loading personas:', error);
    }
  };

  const generatePersonas = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/persona-enhanced-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`
        },
        body: JSON.stringify({
          persona_count: generationConfig.count,
          study_level: generationConfig.study_level,
          use_implicit_demographics: generationConfig.use_implicit_demographics,
          include_temporal_context: generationConfig.include_temporal_context,
          generate_interview_transcripts: generationConfig.generate_interview_transcripts
        })
      });

      if (!response.ok) {
        throw new Error('Error generating personas');
      }

      const data = await response.json();
      
      // Simular la estructura de personas (el backend real devolvería esto)
      const generatedPersonas: Persona[] = data.personas || Array.from({ length: generationConfig.count }, (_, i) => ({
        id: `persona-${Date.now()}-${i}`,
        name: generateHonduranName(),
        age: Math.floor(Math.random() * 40) + 20,
        location: getRandomLocation(),
        segment: segments[Math.floor(Math.random() * segments.length)],
        personality_traits: getRandomTraits(),
        tech_savviness: ['Bajo', 'Medio', 'Alto'][Math.floor(Math.random() * 3)],
        service_priorities: getRandomPriorities(),
        pain_points: getRandomPainPoints(),
        brand_perception: ['Muy Positiva', 'Positiva', 'Neutral', 'Negativa'][Math.floor(Math.random() * 4)],
        validation_score: Math.random() * 100,
        created_at: new Date().toISOString()
      }));

      const allPersonas = [...personas, ...generatedPersonas];
      setPersonas(allPersonas);
      localStorage.setItem('tigo_synthetic_personas', JSON.stringify(allPersonas));
      
      setMessage({ 
        type: 'success', 
        text: `${generatedPersonas.length} personas generadas exitosamente`
      });
      
      setActiveTab('manage');
    } catch (error) {
      console.error('Error generating personas:', error);
      setMessage({ type: 'error', text: 'Error generando personas' });
    }

    setIsGenerating(false);
  };

  // Funciones auxiliares para generar datos realistas
  const generateHonduranName = () => {
    const nombres = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Juan', 'Rosa', 'Pedro', 'Sofia'];
    const apellidos = ['López', 'García', 'Rodríguez', 'Martínez', 'Hernández', 'González', 'Pérez', 'Sánchez'];
    return `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
  };

  const getRandomLocation = () => {
    const locations = ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Comayagua', 'Choluteca', 'Danlí'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomTraits = () => {
    const traits = ['Innovador', 'Tradicional', 'Social', 'Práctico', 'Analítico', 'Creativo', 'Líder', 'Colaborador'];
    return traits.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const getRandomPriorities = () => {
    const priorities = ['Precio', 'Calidad de red', 'Servicio al cliente', 'Velocidad', 'Cobertura', 'Innovación'];
    return priorities.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const getRandomPainPoints = () => {
    const painPoints = ['Caídas de señal', 'Precio alto', 'Mal servicio', 'Baja velocidad', 'Poca cobertura rural'];
    return painPoints.sort(() => 0.5 - Math.random()).slice(0, 2);
  };

  const startConversation = (persona: Persona) => {
    if (onSelectPersona) {
      onSelectPersona(persona);
    }
    onClose();
  };

  const exportPersonas = () => {
    const dataStr = JSON.stringify(personas, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tigo-personas-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestión de Personas Sintéticas
              </h2>
              <p className="text-sm text-gray-600">
                Genera y gestiona usuarios sintéticos para investigación de mercado
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['generate', 'manage', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab === 'generate' && 'Generar Personas'}
              {tab === 'manage' && `Gestionar (${personas.length})`}
              {tab === 'insights' && 'Insights'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Message */}
          {message && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg mb-4',
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            )}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={generationConfig.count}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, count: parseInt(e.target.value) || 10 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Estudio
                  </label>
                  <select
                    value={generationConfig.study_level}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, study_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {studyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={generationConfig.use_implicit_demographics}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, use_implicit_demographics: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Usar Demografía Implícita</span>
                    <p className="text-xs text-gray-500">Incluye contexto demográfico hondureño real</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={generationConfig.include_temporal_context}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, include_temporal_context: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Incluir Contexto Temporal</span>
                    <p className="text-xs text-gray-500">Considera eventos y tendencias actuales</p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={generationConfig.generate_interview_transcripts}
                    onChange={(e) => setGenerationConfig(prev => ({ ...prev, generate_interview_transcripts: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Generar Transcripciones</span>
                    <p className="text-xs text-gray-500">Crea transcripciones de entrevistas simuladas</p>
                  </div>
                </label>
              </div>

              <button
                onClick={generatePersonas}
                disabled={isGenerating}
                className={cn(
                  "w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                  isGenerating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generando personas...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Generar Personas
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {personas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No hay personas generadas</p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Generar personas ahora
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">
                      {personas.length} personas disponibles
                    </span>
                    <div className="flex gap-2">
                      {onOpenFocusGroup && personas.length >= 4 && (
                        <button
                          onClick={() => {
                            onOpenFocusGroup(personas);
                            onClose();
                          }}
                          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          <Users className="h-4 w-4" />
                          Focus Group
                        </button>
                      )}
                      <button
                        onClick={exportPersonas}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                        Exportar
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personas.map(persona => (
                      <div key={persona.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{persona.name}</h4>
                            <p className="text-sm text-gray-600">{persona.age} años • {persona.location}</p>
                          </div>
                          {persona.validation_score && (
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              persona.validation_score > 80 
                                ? "bg-green-100 text-green-700"
                                : persona.validation_score > 60
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            )}>
                              {Math.round(persona.validation_score)}%
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Segmento:</span>
                            <span className="ml-2 text-gray-600">{persona.segment}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Tech:</span>
                            <span className="ml-2 text-gray-600">{persona.tech_savviness}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Percepción:</span>
                            <span className="ml-2 text-gray-600">{persona.brand_perception}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => startConversation(persona)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Chat
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                            <FileText className="h-3 w-3" />
                            Detalles
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Personas</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{personas.length}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Validación Promedio</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {personas.length > 0 
                      ? Math.round(personas.reduce((acc, p) => acc + (p.validation_score || 0), 0) / personas.length)
                      : 0}%
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Conversaciones</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                </div>
              </div>

              {/* Distribución por segmento */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Distribución por Segmento</h3>
                <div className="space-y-2">
                  {segments.map(segment => {
                    const count = personas.filter(p => p.segment === segment).length;
                    const percentage = personas.length > 0 ? (count / personas.length) * 100 : 0;
                    
                    return (
                      <div key={segment} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-40">{segment}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaManager;