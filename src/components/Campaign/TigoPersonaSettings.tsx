// components/Campaign/TigoPersonaSettings.tsx - Configuración avanzada de personas sintéticas TIGO Honduras

import React, { useState, useEffect } from 'react';
import { 
  Save, X, Sliders, Users, Brain, Plus,
  ChevronDown, ChevronUp, AlertCircle, Trash2,
  MapPin, Home, Smartphone, Phone
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  TigoArchetype,
  ARCHETYPE_TEMPLATES
} from '../../types/tigoPersona.types';
import type { 
  SyntheticPersona
} from '../../types/tigoPersona.types';

interface TigoPersonaSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

// Datos específicos de Honduras
const HONDURAN_CITIES = [
  'Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choloma', 
  'El Progreso', 'Comayagua', 'Puerto Cortés', 'Danlí', 
  'Siguatepeque', 'Santa Rosa de Copán', 'Juticalpa', 'Catacamas'
];

const HONDURAN_NEIGHBORHOODS = {
  'Tegucigalpa': ['Centro', 'Comayagüela', 'Colonia Kennedy', 'Lomas del Mayab', 'Residencial Los Ángeles'],
  'San Pedro Sula': ['Centro', 'Colonia Moderna', 'Jardines del Valle', 'Rio de Piedras', 'Colonia Satelite'],
  'La Ceiba': ['Centro', 'Colonia El Sauce', 'Mazapán', 'Los Maestros', 'Villa Olímpica'],
  'default': ['Centro', 'Colonia Central', 'Barrio Nuevo']
};

const NSE_LEVELS = [
  { value: 'A', label: 'A - Alto (L.50,000+)' },
  { value: 'B', label: 'B - Medio Alto (L.25,000-50,000)' },
  { value: 'C+', label: 'C+ - Medio (L.15,000-25,000)' },
  { value: 'C', label: 'C - Medio Bajo (L.8,000-15,000)' },
  { value: 'C-', label: 'C- - Bajo (L.5,000-8,000)' },
  { value: 'D', label: 'D - Muy Bajo (menos de L.5,000)' }
];


const TECH_ADOPTION_LEVELS = [
  'Muy avanzado - early adopter',
  'Avanzado - usa nuevas funciones',
  'Intermedio - funciones básicas',
  'Básico - llamadas y mensajes principalmente',
  'Limitado - uso mínimo necesario'
];

const TigoPersonaSettings: React.FC<TigoPersonaSettingsProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [personas, setPersonas] = useState<SyntheticPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<SyntheticPersona | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<SyntheticPersona>>({});

  useEffect(() => {
    if (isOpen) {
      loadPersonas();
    }
  }, [isOpen]);

  const loadPersonas = () => {
    // Limpiar localStorage de otras versiones
    localStorage.removeItem('unilever_synthetic_personas');
    localStorage.removeItem('alpina_synthetic_personas');
    localStorage.removeItem('nestle_synthetic_personas');
    
    const saved = localStorage.getItem('tigo_honduran_personas');
    if (saved) {
      const loadedPersonas = JSON.parse(saved);
      setPersonas(loadedPersonas);
    } else {
      createDefaultHonduranPersonas();
    }
  };

  const createDefaultHonduranPersonas = () => {
    const defaultPersonas: SyntheticPersona[] = [];
    
    // Crear personas por cada arquetipo con datos hondureños realistas
    Object.entries(ARCHETYPE_TEMPLATES).forEach(([archetypeKey, template]) => {
      const persona: SyntheticPersona = {
        id: `tigo-persona-${archetypeKey}-${Date.now()}`,
        name: generateHonduranName(archetypeKey),
        archetype: archetypeKey as TigoArchetype,
        characteristics: {
          demographics: {
            age: template.characteristics?.demographics?.age || 35,
            gender: template.characteristics?.demographics?.gender || 'male',
            nse: template.characteristics?.demographics?.nse || 'C',
            monthly_income: template.characteristics?.demographics?.monthly_income || 12000,
            education_level: template.characteristics?.demographics?.education_level || 'Secundaria',
            occupation: template.characteristics?.demographics?.occupation || 'Empleado',
            family_status: template.characteristics?.demographics?.family_status || 'Soltero',
            current_telecom_spend: template.characteristics?.demographics?.current_telecom_spend || 800
          },
          location: {
            city: getDefaultCity(archetypeKey),
            neighborhood: 'Centro',
            region: 'Región Central'
          },
          psychographics: {
            lifestyle: template.characteristics?.psychographics?.lifestyle || 'Vida normal',
            values: template.characteristics?.psychographics?.values || ['Familia', 'Trabajo'],
            motivations: template.characteristics?.psychographics?.motivations || ['Estabilidad'],
            main_concerns: template.characteristics?.psychographics?.main_concerns || ['Economía'],
            price_sensitivity: template.characteristics?.psychographics?.price_sensitivity || 'Alta',
            tech_adoption: template.characteristics?.psychographics?.tech_adoption || 'Básico',
            preferred_channels: template.characteristics?.psychographics?.preferred_channels || ['Punto de venta']
          }
        },
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        is_active: true
      };
      
      defaultPersonas.push(persona);
    });

    setPersonas(defaultPersonas);
    savePersonas(defaultPersonas);
  };

  const generateHonduranName = (archetype: string): string => {
    const names: Record<string, string[]> = {
      'PROFESIONAL': ['Carlos Eduardo Martínez', 'María José Restrepo', 'Roberto Antonio Díaz'],
      'CONTROLADOR': ['Ana Isabel Rodríguez', 'Patricia Elena Flores', 'Carmen Leticia Torres'],
      'EMPRENDEDOR': ['José Manuel Mejía', 'Sandra Gabriela López', 'Luis Fernando Castro'],
      'GOMOSO_EXPLORADOR': ['Andrea Sofia Castillo', 'Kevin Alexander Morales', 'Melissa Paola Hernández'],
      'PRAGMATICO': ['Luis Fernando Paz', 'Gloria María Sánchez', 'Mario Roberto Aguilar'],
      'RESIGNADO': ['Pedro José Martínez', 'Rosa Amelia González', 'Francisco Javier Urbina']
    };
    
    const archetypeNames = names[archetype] || ['Juan Carlos López'];
    return archetypeNames[Math.floor(Math.random() * archetypeNames.length)];
  };

  const getDefaultCity = (archetype: string): string => {
    const cityMap: Record<string, string> = {
      'PROFESIONAL': 'Tegucigalpa',
      'CONTROLADOR': 'San Pedro Sula', 
      'EMPRENDEDOR': 'Choloma',
      'GOMOSO_EXPLORADOR': 'Tegucigalpa',
      'PRAGMATICO': 'Santa Rosa de Copán',
      'RESIGNADO': 'Juticalpa'
    };
    
    return cityMap[archetype] || 'Tegucigalpa';
  };

  const savePersonas = (personasToSave: SyntheticPersona[]) => {
    localStorage.setItem('tigo_honduran_personas', JSON.stringify(personasToSave));
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

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setNewPersona({
      id: `tigo-persona-custom-${Date.now()}`,
      name: '',
      archetype: TigoArchetype.PRAGMATICO,
      characteristics: {
        demographics: {
          age: 30,
          gender: 'male',
          nse: 'C',
          monthly_income: 12000,
          education_level: 'Secundaria',
          occupation: '',
          family_status: 'Soltero',
          current_telecom_spend: 800
        },
        location: {
          city: 'Tegucigalpa',
          neighborhood: 'Centro',
          region: 'Región Central'
        },
        psychographics: {
          lifestyle: '',
          values: [],
          motivations: [],
          main_concerns: [],
          price_sensitivity: 'Alta',
          tech_adoption: 'Básico',
          preferred_channels: []
        }
      },
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'user',
      is_active: true
    });
  };

  const handleSaveNewPersona = () => {
    if (newPersona.name && newPersona.characteristics?.location?.city) {
      const completePersona = newPersona as SyntheticPersona;
      const updatedPersonas = [...personas, completePersona];
      setPersonas(updatedPersonas);
      savePersonas(updatedPersonas);
      setIsCreatingNew(false);
      setNewPersona({});
      setSelectedPersona(completePersona);
    }
  };

  const handleDeletePersona = (personaId: string) => {
    if (confirm('¿Estás seguro de eliminar esta persona sintética hondureña?')) {
      const updatedPersonas = personas.filter(p => p.id !== personaId);
      setPersonas(updatedPersonas);
      savePersonas(updatedPersonas);
      if (selectedPersona?.id === personaId) {
        setSelectedPersona(null);
      }
    }
  };

  const updatePersonaField = (field: string, value: any, section?: string, subsection?: string) => {
    if (!selectedPersona) return;

    let updatedPersona = { ...selectedPersona };
    
    if (section && subsection) {
      updatedPersona = {
        ...selectedPersona,
        characteristics: {
          ...selectedPersona.characteristics,
          [section]: {
            ...selectedPersona.characteristics[section as keyof typeof selectedPersona.characteristics],
            [subsection]: {
              ...(selectedPersona.characteristics[section as keyof typeof selectedPersona.characteristics] as any)[subsection],
              [field]: value
            }
          }
        }
      };
    } else if (section) {
      updatedPersona = {
        ...selectedPersona,
        characteristics: {
          ...selectedPersona.characteristics,
          [section]: {
            ...selectedPersona.characteristics[section as keyof typeof selectedPersona.characteristics],
            [field]: value
          }
        }
      };
    } else {
      updatedPersona = {
        ...selectedPersona,
        [field]: value
      };
    }

    updatedPersona.updated_at = new Date();
    setSelectedPersona(updatedPersona);
    setHasChanges(true);
  };

  const sectionConfig = {
    basic: { 
      label: 'Información Básica', 
      icon: Users,
      color: 'blue'
    },
    location: { 
      label: 'Ubicación Honduras', 
      icon: MapPin,
      color: 'green'
    },
    demographics: { 
      label: 'Demografía', 
      icon: Home,
      color: 'purple'
    },
    telecom_behavior: {
      label: 'Comportamiento Telecom',
      icon: Smartphone,
      color: 'orange'
    },
    psychographics: { 
      label: 'Psicografía', 
      icon: Brain,
      color: 'indigo'
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sliders className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración de Personas Sintéticas - TIGO Honduras
              </h2>
              <p className="text-sm text-gray-600">
                Gestiona perfiles de consumidores hondureños de telecomunicaciones
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Hondureños Telecom</h3>
                <button
                  onClick={handleCreateNew}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Crear nueva persona hondureña"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Formulario de nueva persona */}
              {isCreatingNew && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium mb-2">Nueva Persona Hondureña</h4>
                  <input
                    type="text"
                    placeholder="Nombre completo hondureño"
                    value={newPersona.name || ''}
                    onChange={(e) => setNewPersona({...newPersona, name: e.target.value})}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <select
                    value={newPersona.characteristics?.location?.city || ''}
                    onChange={(e) => setNewPersona({
                      ...newPersona,
                      characteristics: {
                        demographics: newPersona.characteristics?.demographics || {
                          age: 30,
                          gender: 'male',
                          nse: 'C',
                          monthly_income: 12000,
                          education_level: 'Secundaria',
                          occupation: '',
                          family_status: 'Soltero',
                          current_telecom_spend: 800
                        },
                        location: {
                          ...newPersona.characteristics?.location,
                          city: e.target.value,
                          region: e.target.value === 'Tegucigalpa' ? 'Región Central' : 'Región Norte'
                        },
                        psychographics: newPersona.characteristics?.psychographics || {
                          lifestyle: '',
                          values: [],
                          motivations: [],
                          main_concerns: [],
                          price_sensitivity: 'Alta',
                          tech_adoption: 'Básico',
                          preferred_channels: []
                        }
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  >
                    {HONDURAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Edad"
                    value={newPersona.characteristics?.demographics?.age || ''}
                    onChange={(e) => setNewPersona({
                      ...newPersona,
                      characteristics: {
                        ...newPersona.characteristics,
                        demographics: {
                          age: parseInt(e.target.value) || 30,
                          gender: 'male',
                          nse: 'C',
                          monthly_income: 12000,
                          education_level: 'Secundaria',
                          occupation: '',
                          family_status: 'Soltero',
                          current_telecom_spend: 800,
                          ...newPersona.characteristics?.demographics
                        },
                        location: newPersona.characteristics?.location || {
                          city: 'Tegucigalpa',
                          region: 'Región Central'
                        },
                        psychographics: newPersona.characteristics?.psychographics || {
                          lifestyle: '',
                          values: [],
                          motivations: [],
                          main_concerns: [],
                          price_sensitivity: 'Alta',
                          tech_adoption: 'Básico',
                          preferred_channels: []
                        }
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNewPersona}
                      className="flex-1 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => {setIsCreatingNew(false); setNewPersona({})}}
                      className="flex-1 px-2 py-1 border text-sm rounded hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {personas.map(persona => (
                  <div
                    key={persona.id}
                    className={cn(
                      "p-3 rounded-lg transition-all cursor-pointer group",
                      selectedPersona?.id === persona.id
                        ? "bg-blue-100 border-blue-500 border"
                        : "bg-white hover:bg-gray-100 border border-gray-200"
                    )}
                    onClick={() => setSelectedPersona(persona)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{persona.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {persona.characteristics.demographics.age} años • {persona.characteristics.location.city}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          NSE {persona.characteristics.demographics.nse} • {persona.characteristics.demographics.occupation}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          📱 {persona.archetype.replace('_', ' ')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePersona(persona.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Edición de Características */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedPersona ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    📱 Editando: {selectedPersona.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Hondureño de {selectedPersona.characteristics.location.city} • {selectedPersona.archetype.replace('_', ' ')}
                  </p>
                  <div className="text-xs text-blue-600 mt-2">
                    NSE {selectedPersona.characteristics.demographics.nse} • L.{selectedPersona.characteristics.demographics.monthly_income.toLocaleString()}/mes
                  </div>
                </div>

                {/* Secciones de edición */}
                {Object.entries(sectionConfig).map(([key, config]) => {
                  const isExpanded = editingSection === key;
                  const Icon = config.icon;
                  
                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setEditingSection(isExpanded ? null : key)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("h-5 w-5", `text-${config.color}-600`)} />
                          <span className="font-medium text-gray-900">{config.label}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4">
                          {key === 'basic' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Hondureño</label>
                                <input
                                  type="text"
                                  value={selectedPersona.name}
                                  onChange={(e) => updatePersonaField('name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="Ej: María José González"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Arquetipo Hondureño</label>
                                <select
                                  value={selectedPersona.archetype}
                                  onChange={(e) => updatePersonaField('archetype', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  {Object.values(TigoArchetype).map(archetype => (
                                    <option key={archetype} value={archetype}>
                                      {archetype.replace('_', ' ')}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {key === 'location' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad Honduras</label>
                                <select
                                  value={selectedPersona.characteristics.location.city}
                                  onChange={(e) => {
                                    updatePersonaField('city', e.target.value, 'location');
                                    // Auto-update region based on city
                                    const region = e.target.value === 'Tegucigalpa' ? 'Región Central' : 
                                                 e.target.value.includes('San Pedro') ? 'Región Norte' : 'Región Central';
                                    updatePersonaField('region', region, 'location');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  {HONDURAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Colonia/Barrio</label>
                                <select
                                  value={selectedPersona.characteristics.location.neighborhood}
                                  onChange={(e) => updatePersonaField('neighborhood', e.target.value, 'location')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  {(HONDURAN_NEIGHBORHOODS[selectedPersona.characteristics.location.city as keyof typeof HONDURAN_NEIGHBORHOODS] || HONDURAN_NEIGHBORHOODS.default).map((neighborhood: string) => (
                                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {key === 'demographics' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NSE Honduras</label>
                                <select
                                  value={selectedPersona.characteristics.demographics.nse}
                                  onChange={(e) => updatePersonaField('nse', e.target.value, 'demographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  {NSE_LEVELS.map(nse => (
                                    <option key={nse.value} value={nse.value}>{nse.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso Mensual (Lempiras)</label>
                                <input
                                  type="number"
                                  value={selectedPersona.characteristics.demographics.monthly_income}
                                  onChange={(e) => updatePersonaField('monthly_income', parseInt(e.target.value), 'demographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="12000"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gasto Telecom Mensual (L.)</label>
                                <input
                                  type="number"
                                  value={selectedPersona.characteristics.demographics.current_telecom_spend}
                                  onChange={(e) => updatePersonaField('current_telecom_spend', parseInt(e.target.value), 'demographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="800"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                                <input
                                  type="text"
                                  value={selectedPersona.characteristics.demographics.occupation}
                                  onChange={(e) => updatePersonaField('occupation', e.target.value, 'demographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="Ej: Comerciante, Estudiante, etc."
                                />
                              </div>
                            </div>
                          )}

                          {key === 'telecom_behavior' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adopción Tecnológica</label>
                                <select
                                  value={selectedPersona.characteristics.psychographics.tech_adoption}
                                  onChange={(e) => updatePersonaField('tech_adoption', e.target.value, 'psychographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  {TECH_ADOPTION_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sensibilidad al Precio</label>
                                <select
                                  value={selectedPersona.characteristics.psychographics.price_sensitivity}
                                  onChange={(e) => updatePersonaField('price_sensitivity', e.target.value, 'psychographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                  <option value="Muy alta">Muy alta - cada lempira cuenta</option>
                                  <option value="Alta">Alta - evalúa cuidadosamente</option>
                                  <option value="Media">Media - balance precio-calidad</option>
                                  <option value="Baja">Baja - prioriza calidad</option>
                                  <option value="Muy baja">Muy baja - precio no es factor</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Canales Preferidos (separados por coma)</label>
                                <input
                                  type="text"
                                  value={selectedPersona.characteristics.psychographics.preferred_channels.join(', ')}
                                  onChange={(e) => updatePersonaField('preferred_channels', e.target.value.split(',').map(s => s.trim()), 'psychographics')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="Punto de venta Tigo, App Mi Tigo, Call center"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Phone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Selecciona un hondureño para editar su perfil telecom</p>
                  <p className="text-sm mt-2">o crea una nueva persona sintética para TIGO</p>
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
                  ? "bg-blue-600 text-white hover:bg-blue-700"
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

export default TigoPersonaSettings;