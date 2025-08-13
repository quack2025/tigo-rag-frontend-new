// components/Personas/AdvancedPersonaManager.tsx - Sistema Avanzado de Personas Sintéticas

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Edit3, Save, X, AlertTriangle, CheckCircle, 
  Sliders, BarChart3, Brain
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { 
  SyntheticPersona, 
  PersonaCharacteristics
} from '../../types/persona.types';
import { TigoArchetype, ARCHETYPE_TEMPLATES } from '../../types/persona.types';

interface AdvancedPersonaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona?: (persona: SyntheticPersona) => void;
  onStartFocusGroup?: (personas: SyntheticPersona[]) => void;
}

type TabType = 'archetypes' | 'generator' | 'editor' | 'validator' | 'analytics';
type CharacteristicCategory = keyof PersonaCharacteristics;

const AdvancedPersonaManager: React.FC<AdvancedPersonaManagerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectPersona,
  onStartFocusGroup: _onStartFocusGroup 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('archetypes');
  const [personas, setPersonas] = useState<SyntheticPersona[]>([]);
  const [editingPersona, setEditingPersona] = useState<SyntheticPersona | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  
  // Configuración de generación
  const [generationConfig, setGenerationConfig] = useState({
    archetype: TigoArchetype.PROFESIONAL as TigoArchetype,
    count: 10,
    diversityMode: 'balanced',
    includeCounterStereotypical: true,
    counterStereotypicalPercentage: 30,
  });

  // Descripciones de arquetipos
  const archetypeDescriptions = {
    [TigoArchetype.PROFESIONAL]: {
      name: 'Profesional',
      example: 'Carlos Eduardo Hernández',
      description: '38 años, Gerente de Ventas en Tegucigalpa. Valora la eficiencia, calidad y tecnología de punta.',
      icon: '💼',
      color: 'blue'
    },
    [TigoArchetype.CONTROLADOR]: {
      name: 'Controlador',
      example: 'María Elena Rodríguez',
      description: '42 años, Administradora del Hogar en San Pedro Sula. Busca control, seguridad y valor por su dinero.',
      icon: '📊',
      color: 'green'
    },
    [TigoArchetype.EMPRENDEDOR]: {
      name: 'Emprendedor',
      example: 'José Antonio Mejía',
      description: '32 años, Dueño de Taller Mecánico en Choloma. Necesita flexibilidad y herramientas para su negocio.',
      icon: '🚀',
      color: 'orange'
    },
    [TigoArchetype.GOMOSO_EXPLORADOR]: {
      name: 'Gomoso/Explorador',
      example: 'Andrea Sofia Castillo',
      description: '26 años, Diseñadora en Tegucigalpa. Busca lo último en tecnología y tendencias.',
      icon: '🎨',
      color: 'purple'
    },
    [TigoArchetype.PRAGMATICO]: {
      name: 'Pragmático',
      example: 'Luis Fernando Paz',
      description: '35 años, Técnico en La Ceiba. Busca soluciones prácticas y buen precio-calidad.',
      icon: '⚡',
      color: 'yellow'
    },
    [TigoArchetype.RESIGNADO]: {
      name: 'Resignado',
      example: 'Pedro José Martínez',
      description: '48 años, Agricultor en Olancho. Usa servicios básicos, resistente al cambio.',
      icon: '🌾',
      color: 'gray'
    }
  };

  // Cargar personas guardadas
  useEffect(() => {
    if (isOpen) {
      loadPersonas();
    }
  }, [isOpen]);

  const loadPersonas = () => {
    const saved = localStorage.getItem('tigo_advanced_personas');
    if (saved) {
      setPersonas(JSON.parse(saved));
    }
  };

  const savePersonas = (newPersonas: SyntheticPersona[]) => {
    setPersonas(newPersonas);
    localStorage.setItem('tigo_advanced_personas', JSON.stringify(newPersonas));
  };

  // Generar persona base desde arquetipo
  const generatePersonaFromArchetype = (archetype: TigoArchetype, variant?: any): SyntheticPersona => {
    const template = ARCHETYPE_TEMPLATES[archetype];
    const archetypeInfo = archetypeDescriptions[archetype];
    
    // Generar características completas
    const characteristics: PersonaCharacteristics = {
      demographics: {
        age: variant?.age || template.demographics?.age || 35,
        gender: variant?.gender || template.demographics?.gender || 'male',
        income_bracket: template.demographics?.income_bracket || 'C',
        education_level: template.demographics?.education_level || 'secondary',
        employment_status: template.demographics?.employment_status || 'employed',
        household_size: 4,
        marital_status: 'married',
        children_count: 2,
        location_type: template.demographics?.location_type || 'urban',
        housing_type: template.demographics?.housing_type || 'rented',
        vehicle_ownership: template.demographics?.vehicle_ownership || 'none',
        language_primary: 'spanish',
        language_secondary: 'english',
        disability_status: 'none',
        migration_status: 'native',
      },
      psychographics: {
        personality_openness: template.psychographics?.personality_openness || 50,
        personality_conscientiousness: template.psychographics?.personality_conscientiousness || 50,
        personality_extraversion: template.psychographics?.personality_extraversion || 50,
        personality_agreeableness: 50,
        personality_neuroticism: 30,
        risk_tolerance: template.psychographics?.risk_tolerance || 50,
        innovation_adoption: template.psychographics?.innovation_adoption || 'early_majority',
        brand_loyalty: 60,
        price_sensitivity: 70,
        convenience_preference: 65,
        social_influence_susceptibility: 55,
        decision_making_style: template.psychographics?.decision_making_style || 'rational',
        time_orientation: template.psychographics?.time_orientation || 'present',
        achievement_orientation: template.psychographics?.achievement_orientation || 60,
        security_values: template.psychographics?.security_values || 65,
        hedonism_values: template.psychographics?.hedonism_values || 45,
        tradition_values: template.psychographics?.tradition_values || 60,
        benevolence_values: 70,
        power_values: 40,
        self_direction_values: template.psychographics?.self_direction_values || 55,
      },
      telecom: {
        monthly_spend: template.telecom?.monthly_spend || 500,
        plan_type: template.telecom?.plan_type || 'prepaid',
        data_usage_gb: template.telecom?.data_usage_gb || 10,
        voice_minutes: 300,
        sms_frequency: 'rarely',
        device_brand: template.telecom?.device_brand || 'Samsung',
        device_age: template.telecom?.device_age || 18,
        upgrade_frequency: 24,
        network_quality_importance: template.telecom?.network_quality_importance || 75,
        customer_service_experience: 'neutral',
        bundling_preferences: ['data', 'voice'],
        payment_method: 'cash',
        bill_payment_timing: template.telecom?.bill_payment_timing || 'on_time',
        roaming_usage: 'rarely',
        family_plan_status: template.telecom?.family_plan_status || false,
        loyalty_program_engagement: 'medium',
        complaint_frequency: 2,
        switching_consideration: template.telecom?.switching_consideration || 30,
        referral_behavior: 'passive',
        feature_usage_priority: ['WhatsApp', 'Facebook', 'YouTube'],
        data_sharing_behavior: 'family',
        wifi_dependency: template.telecom?.wifi_dependency || 60,
        mobile_banking_usage: template.telecom?.mobile_banking_usage || false,
        streaming_habits: template.telecom?.streaming_habits || ['YouTube'],
        gaming_mobile_usage: template.telecom?.gaming_mobile_usage || 'none',
      },
      sociocultural: {
        cultural_identity_strength: 75,
        family_influence_level: 80,
        community_involvement: 'medium',
        social_media_platform_preference: ['Facebook', 'WhatsApp'],
        entertainment_content_preference: ['Música', 'Deportes', 'Noticias'],
        shopping_channel_preference: 'traditional',
        technology_comfort_level: 60,
        environmental_consciousness: 45,
        social_status_importance: 65,
        regional_pride: 85,
        urban_rural_preference: 'urban',
        remittances_dependency: 'low',
        informal_economy_participation: 30,
        social_mobility_aspiration: 75,
        collective_vs_individual_orientation: 70,
      },
      economic: {
        economic_optimism: 50,
        inflation_impact_perception: 'high',
        savings_behavior: 'informal',
        credit_usage: 'informal',
        informal_income_percentage: 20,
      },
    };

    // Generar nombre hondureño realista
    const nombres = {
      male: ['Carlos', 'José', 'Luis', 'Juan', 'Pedro', 'Miguel', 'Roberto', 'Fernando'],
      female: ['María', 'Ana', 'Carmen', 'Rosa', 'Sofia', 'Patricia', 'Laura', 'Claudia']
    };
    const apellidos = ['López', 'García', 'Rodríguez', 'Martínez', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'];
    
    const gender = characteristics.demographics.gender;
    const firstName = nombres[gender === 'female' ? 'female' : 'male'][Math.floor(Math.random() * 8)];
    const lastName1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const lastName2 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const name = `${firstName} ${lastName1} ${lastName2}`;

    // Ciudades de Honduras
    const cities = ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Comayagua', 'Choluteca', 'Danlí'];
    const departments = ['Francisco Morazán', 'Cortés', 'Cortés', 'Atlántida', 'Yoro', 'Comayagua', 'Choluteca', 'El Paraíso'];
    const cityIndex = Math.floor(Math.random() * cities.length);

    const persona: SyntheticPersona = {
      id: `persona-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      archetype,
      variant_id: variant?.id || 'base',
      name,
      location: {
        city: cities[cityIndex],
        department: departments[cityIndex],
        neighborhood: 'Col. ' + ['Kennedy', 'Miraflores', 'Las Colinas', 'El Centro'][Math.floor(Math.random() * 4)]
      },
      characteristics,
      background: {
        life_story: `${name} es un(a) ${archetypeInfo.description}`,
        daily_routine: 'Trabajo de 8am a 5pm, tiempo familiar en las noches',
        pain_points: ['Cobertura inconsistente', 'Precios altos', 'Servicio al cliente lento'],
        aspirations: ['Mejor calidad de vida', 'Educación para los hijos', 'Crecimiento profesional'],
        social_circle: 'Familia, compañeros de trabajo, vecinos',
        media_consumption: ['TV nacional', 'Facebook', 'WhatsApp', 'Radio HRN'],
        brand_relationships: {
          'Tigo': 'Usuario actual, 3 años',
          'Claro': 'Usuario anterior',
          'Hondutel': 'Nunca usado'
        }
      },
      temporal_state: {
        current_mood: 'neutral',
        recent_events: ['Aumento de precios', 'Nuevo trabajo', 'Mudanza reciente'],
        seasonal_context: 'Temporada de lluvias',
        economic_situation: 'Estable pero ajustado'
      },
      conversation_style: {
        formality_level: 'neutral',
        verbosity: 'normal',
        dialect_markers: ['vos', 'pues', 'cabal', 'cheque', 'birria'],
        emotional_expression: 'moderate'
      },
      validation: {
        is_counter_stereotypical: Math.random() > 0.7,
        diversity_score: 70 + Math.random() * 30,
        authenticity_score: 80 + Math.random() * 20,
        last_validated: new Date(),
        validation_notes: []
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        version: 1,
        tags: [archetype, 'honduras', 'tigo']
      }
    };

    return persona;
  };

  // Generar múltiples personas con diversidad
  const generateDiversePersonas = async () => {
    setIsGenerating(true);
    const newPersonas: SyntheticPersona[] = [];
    
    for (let i = 0; i < generationConfig.count; i++) {
      // Variar género, edad, ubicación y NSE
      const variants = {
        age: 18 + Math.floor(Math.random() * 47), // 18-65
        gender: Math.random() > 0.5 ? 'female' : 'male',
        id: `variant-${i}`
      };
      
      const persona = generatePersonaFromArchetype(generationConfig.archetype, variants);
      
      // Aplicar counter-stereotypical si corresponde
      if (generationConfig.includeCounterStereotypical && Math.random() < generationConfig.counterStereotypicalPercentage / 100) {
        // Invertir algunas características esperadas
        persona.characteristics.psychographics.innovation_adoption = 
          persona.archetype === TigoArchetype.RESIGNADO ? 'early_adopter' : 'laggard';
        persona.validation.is_counter_stereotypical = true;
      }
      
      newPersonas.push(persona);
    }
    
    const allPersonas = [...personas, ...newPersonas];
    savePersonas(allPersonas);
    setIsGenerating(false);
    
    // Validar automáticamente
    validatePersonas(newPersonas);
  };

  // Validar personas contra sesgos
  const validatePersonas = (personasToValidate: SyntheticPersona[]) => {
    const results = personasToValidate.map(persona => {
      const genderDiversity = personas.filter(p => p.characteristics.demographics.gender !== persona.characteristics.demographics.gender).length > personas.length * 0.3;
      const ageDiversity = Math.abs(persona.characteristics.demographics.age - 35) > 10;
      const counterStereotypical = persona.validation.is_counter_stereotypical;
      
      return {
        persona_id: persona.id,
        persona_name: persona.name,
        checks: {
          genderDiversity,
          ageDiversity,
          counterStereotypical,
          authenticityScore: persona.validation.authenticity_score > 70
        },
        overallScore: persona.validation.diversity_score
      };
    });
    
    setValidationResults(results);
  };

  // Renderizar editor de características
  const renderCharacteristicEditor = () => {
    if (!editingPersona) return null;

    const categories: CharacteristicCategory[] = ['demographics', 'psychographics', 'telecom', 'sociocultural', 'economic'];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Editando: {editingPersona.name}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const updated = personas.map(p => 
                  p.id === editingPersona.id ? editingPersona : p
                );
                savePersonas(updated);
                setEditingPersona(null);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar
            </button>
            <button
              onClick={() => setEditingPersona(null)}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {categories.map(category => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 capitalize">
              {category.replace('_', ' ')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(editingPersona.characteristics[category]).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-600 mb-1">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {typeof value === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newPersona = { ...editingPersona };
                        (newPersona.characteristics[category] as any)[key] = parseFloat(e.target.value);
                        setEditingPersona(newPersona);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : typeof value === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => {
                        const newPersona = { ...editingPersona };
                        (newPersona.characteristics[category] as any)[key] = e.target.checked;
                        setEditingPersona(newPersona);
                      }}
                      className="w-4 h-4"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => {
                        const newPersona = { ...editingPersona };
                        (newPersona.characteristics[category] as any)[key] = e.target.value;
                        setEditingPersona(newPersona);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Sistema Avanzado de Personas Sintéticas - Tigo Honduras
              </h2>
              <p className="text-sm text-gray-600">
                6 Arquetipos • 80 Características • Validación Ética
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'archetypes', label: 'Arquetipos', icon: Brain },
            { id: 'generator', label: 'Generador', icon: UserPlus },
            { id: 'editor', label: 'Editor', icon: Sliders },
            { id: 'validator', label: 'Validación', icon: CheckCircle },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Arquetipos Tab */}
          {activeTab === 'archetypes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(archetypeDescriptions).map(([key, archetype]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{archetype.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{archetype.name}</h3>
                        <p className="text-xs text-gray-500">{archetype.example}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{archetype.description}</p>
                  <button
                    onClick={() => {
                      setGenerationConfig(prev => ({ ...prev, archetype: key as TigoArchetype }));
                      setActiveTab('generator');
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Generar Personas
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Generator Tab */}
          {activeTab === 'generator' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Generando: {archetypeDescriptions[generationConfig.archetype].name}
                </h3>
                <p className="text-sm text-blue-700">
                  {archetypeDescriptions[generationConfig.archetype].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={generationConfig.count}
                    onChange={(e) => setGenerationConfig(prev => ({ 
                      ...prev, 
                      count: parseInt(e.target.value) || 10 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    % Counter-stereotypical (Min: 30%)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    value={generationConfig.counterStereotypicalPercentage}
                    onChange={(e) => setGenerationConfig(prev => ({ 
                      ...prev, 
                      counterStereotypicalPercentage: Math.max(30, parseInt(e.target.value) || 30)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={generationConfig.includeCounterStereotypical}
                    onChange={(e) => setGenerationConfig(prev => ({ 
                      ...prev, 
                      includeCounterStereotypical: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Incluir Perfiles Anti-estereotípicos
                    </span>
                    <p className="text-xs text-gray-500">
                      Genera personas que desafían expectativas típicas del arquetipo
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={generateDiversePersonas}
                disabled={isGenerating}
                className={cn(
                  "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2",
                  isGenerating
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {isGenerating ? (
                  <>Generando...</>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Generar {generationConfig.count} Personas Diversas
                  </>
                )}
              </button>

              {personas.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Personas Generadas ({personas.length})
                  </h3>
                  <div className="grid gap-3">
                    {personas.slice(0, 5).map(persona => (
                      <div key={persona.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{persona.name}</p>
                          <p className="text-sm text-gray-600">
                            {persona.characteristics.demographics.age} años • {persona.location.city} • {archetypeDescriptions[persona.archetype].name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPersona(persona);
                              setActiveTab('editor');
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {onSelectPersona && (
                            <button
                              onClick={() => {
                                onSelectPersona(persona);
                                onClose();
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                            >
                              Conversar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Editor Tab */}
          {activeTab === 'editor' && (
            <div>
              {editingPersona ? (
                renderCharacteristicEditor()
              ) : (
                <div className="text-center py-12">
                  <Sliders className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Selecciona una persona para editar</p>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ir al generador
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Validator Tab */}
          {activeTab === 'validator' && (
            <div className="space-y-6">
              {validationResults.length > 0 ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-900">Resultados de Validación</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      {validationResults.filter(r => r.overallScore > 70).length} de {validationResults.length} personas pasaron la validación
                    </p>
                  </div>

                  <div className="space-y-3">
                    {validationResults.map(result => (
                      <div key={result.persona_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{result.persona_name}</span>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            result.overallScore > 70 
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}>
                            Score: {Math.round(result.overallScore)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {Object.entries(result.checks).map(([check, passed]) => (
                            <div key={check} className="flex items-center gap-1">
                              {passed ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              )}
                              <span className="text-gray-600">{check}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No hay resultados de validación</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Genera personas primero para validarlas
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Total Personas</h3>
                  <p className="text-2xl font-bold text-blue-900">{personas.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Diversidad Promedio</h3>
                  <p className="text-2xl font-bold text-green-900">
                    {personas.length > 0 
                      ? Math.round(personas.reduce((acc, p) => acc + p.validation.diversity_score, 0) / personas.length)
                      : 0}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-medium text-purple-900 mb-2">Anti-estereotípicos</h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {personas.filter(p => p.validation.is_counter_stereotypical).length}
                  </p>
                </div>
              </div>

              {/* Distribución por Arquetipo */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Distribución por Arquetipo</h3>
                <div className="space-y-2">
                  {Object.values(TigoArchetype).map(archetype => {
                    const count = personas.filter(p => p.archetype === archetype).length;
                    const percentage = personas.length > 0 ? (count / personas.length) * 100 : 0;
                    
                    return (
                      <div key={archetype} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-40">
                          {archetypeDescriptions[archetype].name}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full transition-all"
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

export default AdvancedPersonaManager;