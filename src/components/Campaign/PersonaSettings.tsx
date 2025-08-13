// components/Campaign/PersonaSettings.tsx - Configuración avanzada de personas sintéticas

import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, X, Sliders, Users, Brain, 
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SyntheticPersona, PersonaCharacteristics } from '../../types/persona.types';
import { TigoArchetype, ARCHETYPE_TEMPLATES } from '../../types/persona.types';

interface PersonaSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

type CharacteristicCategory = keyof PersonaCharacteristics;

const PersonaSettings: React.FC<PersonaSettingsProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [personas, setPersonas] = useState<SyntheticPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<SyntheticPersona | null>(null);
  const [editingCategory, setEditingCategory] = useState<CharacteristicCategory | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar personas guardadas
  useEffect(() => {
    if (isOpen) {
      loadPersonas();
    }
  }, [isOpen]);

  const loadPersonas = () => {
    const saved = localStorage.getItem('tigo_campaign_personas');
    if (saved) {
      const loadedPersonas = JSON.parse(saved);
      setPersonas(loadedPersonas);
    } else {
      // Crear personas por defecto si no existen
      createDefaultPersonas();
    }
  };

  const createDefaultPersonas = () => {
    const defaultPersonas: SyntheticPersona[] = [];
    
    Object.values(TigoArchetype).forEach(archetype => {
      const template = ARCHETYPE_TEMPLATES[archetype];
      const persona: SyntheticPersona = {
        id: `persona-default-${archetype}`,
        archetype,
        variant_id: 'default',
        name: getDefaultName(archetype),
        location: getDefaultLocation(archetype),
        characteristics: {
          demographics: {
            age: template.demographics?.age || 35,
            gender: template.demographics?.gender || 'male',
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
        },
        background: {
          life_story: `Persona representativa del arquetipo ${archetype}`,
          daily_routine: 'Rutina típica hondureña',
          pain_points: ['Cobertura', 'Precio', 'Servicio'],
          aspirations: ['Mejor calidad de vida', 'Progreso'],
          social_circle: 'Familia y amigos',
          media_consumption: ['TV', 'Radio', 'Redes sociales'],
          brand_relationships: {
            'Tigo': 'Usuario actual',
            'Claro': 'Conocido',
            'Hondutel': 'Conocido'
          }
        },
        temporal_state: {
          current_mood: 'neutral',
          recent_events: [],
          seasonal_context: 'Normal',
          economic_situation: 'Estable'
        },
        conversation_style: {
          formality_level: 'neutral',
          verbosity: 'normal',
          dialect_markers: ['vos', 'pues'],
          emotional_expression: 'moderate'
        },
        validation: {
          is_counter_stereotypical: false,
          diversity_score: 70,
          authenticity_score: 85,
          last_validated: new Date(),
          validation_notes: []
        },
        metadata: {
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 'system',
          version: 1,
          tags: [archetype, 'honduras', 'default']
        }
      };
      
      defaultPersonas.push(persona);
    });

    setPersonas(defaultPersonas);
    savePersonas(defaultPersonas);
  };

  const getDefaultName = (archetype: string): string => {
    const names = {
      [TigoArchetype.PROFESIONAL]: 'Carlos Eduardo Martínez',
      [TigoArchetype.CONTROLADOR]: 'María Elena Rodríguez',
      [TigoArchetype.EMPRENDEDOR]: 'José Antonio Mejía',
      [TigoArchetype.GOMOSO_EXPLORADOR]: 'Andrea Sofia Castillo',
      [TigoArchetype.PRAGMATICO]: 'Luis Fernando Paz',
      [TigoArchetype.RESIGNADO]: 'Pedro José Martínez'
    };
    return names[archetype as keyof typeof names] || 'Persona Sin Nombre';
  };

  const getDefaultLocation = (archetype: string): any => {
    const locations = {
      [TigoArchetype.PROFESIONAL]: { city: 'Tegucigalpa', department: 'Francisco Morazán', neighborhood: 'Col. Lomas del Guijarro' },
      [TigoArchetype.CONTROLADOR]: { city: 'San Pedro Sula', department: 'Cortés', neighborhood: 'Col. Jardines del Valle' },
      [TigoArchetype.EMPRENDEDOR]: { city: 'Choloma', department: 'Cortés', neighborhood: 'Barrio El Centro' },
      [TigoArchetype.GOMOSO_EXPLORADOR]: { city: 'Tegucigalpa', department: 'Francisco Morazán', neighborhood: 'Col. Palmira' },
      [TigoArchetype.PRAGMATICO]: { city: 'La Ceiba', department: 'Atlántida', neighborhood: 'Barrio La Isla' },
      [TigoArchetype.RESIGNADO]: { city: 'Juticalpa', department: 'Olancho', neighborhood: 'Barrio El Centro' }
    };
    return locations[archetype as keyof typeof locations] || { city: 'Tegucigalpa', department: 'Francisco Morazán', neighborhood: 'Centro' };
  };

  const savePersonas = (personasToSave: SyntheticPersona[]) => {
    localStorage.setItem('tigo_campaign_personas', JSON.stringify(personasToSave));
    setHasChanges(false);
  };

  const handleSave = () => {
    if (selectedPersona) {
      const updatedPersonas = personas.map(p => 
        p.id === selectedPersona.id ? selectedPersona : p
      );
      setPersonas(updatedPersonas);
      savePersonas(updatedPersonas);
    }
    onSave?.();
    onClose();
  };

  const updateCharacteristic = (
    category: CharacteristicCategory,
    field: string,
    value: any
  ) => {
    if (!selectedPersona) return;

    const updatedPersona = {
      ...selectedPersona,
      characteristics: {
        ...selectedPersona.characteristics,
        [category]: {
          ...selectedPersona.characteristics[category],
          [field]: value
        }
      },
      metadata: {
        ...selectedPersona.metadata,
        updated_at: new Date()
      }
    };

    setSelectedPersona(updatedPersona);
    setHasChanges(true);
  };

  const categoryLabels = {
    demographics: { label: 'Demografía', icon: Users, count: 15 },
    psychographics: { label: 'Psicografía', icon: Brain, count: 20 },
    telecom: { label: 'Telecomunicaciones', icon: Settings, count: 25 },
    sociocultural: { label: 'Sociocultural', icon: Users, count: 15 },
    economic: { label: 'Económico', icon: Settings, count: 5 }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sliders className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración de Personas Sintéticas
              </h2>
              <p className="text-sm text-gray-600">
                Ajusta las 80 características de cada arquetipo
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Lista de Personas */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Arquetipos Disponibles</h3>
              <div className="space-y-2">
                {personas.map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      selectedPersona?.id === persona.id
                        ? "bg-emerald-100 border-emerald-500 border"
                        : "bg-white hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    <div className="font-medium text-gray-900">{persona.name}</div>
                    <div className="text-xs text-gray-600">{persona.archetype}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {persona.characteristics.demographics.age} años • {persona.location.city}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Características */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedPersona ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-medium text-emerald-900 mb-2">
                    Editando: {selectedPersona.name}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Arquetipo {selectedPersona.archetype} • {selectedPersona.location.city}
                  </p>
                </div>

                {/* Categorías de Características */}
                {Object.entries(categoryLabels).map(([category, info]) => {
                  const isExpanded = editingCategory === category;
                  const Icon = info.icon;
                  
                  return (
                    <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setEditingCategory(isExpanded ? null : category as CharacteristicCategory)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{info.label}</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            {info.count} características
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 grid grid-cols-2 gap-4">
                          {Object.entries(selectedPersona.characteristics[category as CharacteristicCategory]).map(([field, value]) => (
                            <div key={field}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                              {typeof value === 'number' ? (
                                <input
                                  type="number"
                                  value={value}
                                  onChange={(e) => updateCharacteristic(
                                    category as CharacteristicCategory,
                                    field,
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                                />
                              ) : typeof value === 'boolean' ? (
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => updateCharacteristic(
                                    category as CharacteristicCategory,
                                    field,
                                    e.target.checked
                                  )}
                                  className="h-4 w-4 text-emerald-600 rounded"
                                />
                              ) : Array.isArray(value) ? (
                                <input
                                  type="text"
                                  value={value.join(', ')}
                                  onChange={(e) => updateCharacteristic(
                                    category as CharacteristicCategory,
                                    field,
                                    e.target.value.split(',').map(s => s.trim())
                                  )}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                                  placeholder="Separados por comas"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={value as string}
                                  onChange={(e) => updateCharacteristic(
                                    category as CharacteristicCategory,
                                    field,
                                    e.target.value
                                  )}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Selecciona un arquetipo para editar sus características</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Cambios sin guardar</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn(
                "px-6 py-2 rounded-lg flex items-center gap-2 transition-colors",
                hasChanges
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              <Save className="h-4 w-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSettings;