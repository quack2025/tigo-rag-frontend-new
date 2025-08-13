// components/Campaign/ArchetypeSelector.tsx - Selector de arquetipos para evaluación

import React, { useState } from 'react';
import { 
  Users, Play, CheckCircle, AlertTriangle, Info, 
  TrendingUp, Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { TigoArchetype } from '../../types/persona.types';
import type { CampaignConcept } from '../../types/campaign.types';

interface ArchetypeSelectorProps {
  concept: CampaignConcept;
  onStartEvaluation: (selectedArchetypes: string[]) => void;
  onBack: () => void;
}

const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({ 
  concept, 
  onStartEvaluation, 
  onBack 
}) => {
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Información detallada de cada arquetipo
  const archetypeDetails = {
    [TigoArchetype.PROFESIONAL]: {
      name: 'Profesional',
      icon: '💼',
      description: 'Ejecutivos y profesionales de clase media-alta',
      characteristics: ['Busca eficiencia', 'Valora calidad', 'Tiempo limitado', 'Tech-savvy'],
      demographics: '28-45 años • Tegucigalpa/SPS • NSE B+',
      color: 'blue',
      insights: ['Sensible a beneficios funcionales', 'Valora prestigio de marca', 'Prefiere canales digitales'],
      concerns: ['Tiempo de implementación', 'Compatibilidad con herramientas actuales']
    },
    [TigoArchetype.CONTROLADOR]: {
      name: 'Controlador',
      icon: '📊',
      description: 'Administradores del hogar, decisores familiares',
      characteristics: ['Compara precios', 'Busca seguridad', 'Planifica gastos', 'Influencer familiar'],
      demographics: '35-50 años • Todo Honduras • NSE C',
      color: 'green',
      insights: ['Muy sensible al precio', 'Necesita garantías claras', 'Influye en decisiones familiares'],
      concerns: ['Costos ocultos', 'Cambios en términos y condiciones']
    },
    [TigoArchetype.EMPRENDEDOR]: {
      name: 'Emprendedor',
      icon: '🚀',
      description: 'Dueños de pequeños negocios y comerciantes',
      characteristics: ['Necesita flexibilidad', 'ROI importante', 'Herramientas de negocio', 'Crecimiento'],
      demographics: '30-50 años • Ciudades intermedias • NSE C+',
      color: 'orange',
      insights: ['Enfoque en beneficios de negocio', 'Valora escalabilidad', 'Aprecia soporte personalizado'],
      concerns: ['Interrupciones de servicio', 'Complejidad de implementación']
    },
    [TigoArchetype.GOMOSO_EXPLORADOR]: {
      name: 'Gomoso/Explorador',
      icon: '🎨',
      description: 'Jóvenes trendy, early adopters, influencers',
      characteristics: ['Sigue tendencias', 'Comparte experiencias', 'Visual/estético', 'Social media'],
      demographics: '18-30 años • Urbano • NSE B/C+',
      color: 'purple',
      insights: ['Atraído por innovación', 'Importante el factor "cool"', 'Influye en redes sociales'],
      concerns: ['Que se vea "mainstream"', 'Limitaciones de personalización']
    },
    [TigoArchetype.PRAGMATICO]: {
      name: 'Pragmático',
      icon: '⚡',
      description: 'Buscan soluciones simples y efectivas',
      characteristics: ['Funcionalidad básica', 'Buen precio', 'Sin complicaciones', 'Confiabilidad'],
      demographics: '25-45 años • Rural/Urbano • NSE C',
      color: 'yellow',
      insights: ['Valora simplicidad sobre características', 'Precio-calidad es clave', 'Prefiere lo probado'],
      concerns: ['Complejidad innecesaria', 'Precios que no justifiquen el valor']
    },
    [TigoArchetype.RESIGNADO]: {
      name: 'Resignado',
      icon: '🌾',
      description: 'Usuarios tradicionales, resistentes al cambio',
      characteristics: ['Prefiere lo conocido', 'Desconfianza inicial', 'Apoyo importante', 'Gradual'],
      demographics: '40+ años • Rural principalmente • NSE D+',
      color: 'gray',
      insights: ['Necesita mucho apoyo', 'Cambio debe ser gradual', 'Familia influye en decisión'],
      concerns: ['Pérdida de lo conocido', 'Dificultad de uso', 'Costos adicionales']
    }
  };

  const toggleArchetype = (archetype: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(archetype)
        ? prev.filter(a => a !== archetype)
        : [...prev, archetype]
    );
  };

  const selectAll = () => {
    setSelectedArchetypes(Object.values(TigoArchetype));
  };

  const clearAll = () => {
    setSelectedArchetypes([]);
  };

  const handleStartEvaluation = async () => {
    if (selectedArchetypes.length === 0) return;
    
    setIsEvaluating(true);
    // Simular proceso de evaluación
    await new Promise(resolve => setTimeout(resolve, 2000));
    onStartEvaluation(selectedArchetypes);
    setIsEvaluating(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selecciona los Segmentos a Evaluar
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elige qué arquetipos hondureños quieres que evalúen <strong>"{concept.name}"</strong>. 
          Cada segmento dará su perspectiva única sobre el concepto.
        </p>
      </div>

      {/* Concepto info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            {concept.type === 'campaign' ? 
              <Users className="h-5 w-5 text-white" /> : 
              <Target className="h-5 w-5 text-white" />
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-emerald-900">{concept.name}</span>
              {concept.monthly_price && (
                <span className="text-sm text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  L {concept.monthly_price.toLocaleString()}/mes
                </span>
              )}
            </div>
            <p className="text-sm text-emerald-800">{concept.description}</p>
          </div>
        </div>
      </div>

      {/* Controles de selección */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedArchetypes.length} de {Object.keys(archetypeDetails).length} seleccionados
          </span>
          <button
            onClick={selectAll}
            className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
          >
            Seleccionar todos
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Limpiar selección
          </button>
        </div>
        
        {selectedArchetypes.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="h-4 w-4" />
            Tiempo estimado: {selectedArchetypes.length * 30}s
          </div>
        )}
      </div>

      {/* Grid de arquetipos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(archetypeDetails).map(([key, archetype]) => {
          const isSelected = selectedArchetypes.includes(key);
          
          return (
            <div
              key={key}
              className={cn(
                "bg-white border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg",
                isSelected
                  ? "border-emerald-500 shadow-md bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => toggleArchetype(key)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{archetype.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{archetype.name}</h3>
                    <p className="text-xs text-gray-500">{archetype.demographics}</p>
                  </div>
                </div>
                
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-gray-300"
                )}>
                  {isSelected && <CheckCircle className="h-3 w-3 text-white fill-current" />}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{archetype.description}</p>

              {/* Características */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Características clave:</h4>
                <div className="flex flex-wrap gap-1">
                  {archetype.characteristics.slice(0, 3).map((char, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insights rápidos */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600 truncate">{archetype.insights[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-orange-600" />
                  <span className="text-gray-600 truncate">{archetype.concerns[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {selectedArchetypes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">¿Qué sucederá en la evaluación?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cada segmento evaluará todas las variables del concepto (nombre, descripción, beneficios, etc.)</li>
                <li>• Recibirás reacciones detalladas y puntajes específicos por cada aspecto</li>
                <li>• Verás insights, preocupaciones y sugerencias de mejora específicas por segmento</li>
                <li>• Obtendrás probabilidades de adopción y recomendación por arquetipo</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Modificar Concepto
        </button>
        
        <button
          onClick={handleStartEvaluation}
          disabled={selectedArchetypes.length === 0 || isEvaluating}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
            selectedArchetypes.length > 0 && !isEvaluating
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Evaluando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Iniciar Evaluación ({selectedArchetypes.length})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ArchetypeSelector;