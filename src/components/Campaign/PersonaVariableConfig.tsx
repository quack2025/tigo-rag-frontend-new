// components/Campaign/PersonaVariableConfig.tsx
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface PersonaVariable {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[]; // Para tipo select
  required: boolean;
}

interface PersonaVariableConfigProps {
  variables: PersonaVariable[];
  onVariablesChange: (variables: PersonaVariable[]) => void;
}

const DEFAULT_VARIABLES: PersonaVariable[] = [
  {
    id: 'income_level',
    name: 'Nivel de Ingresos',
    description: 'Rango de ingresos mensuales familiares',
    type: 'select',
    options: ['Bajo (< $15,000)', 'Medio-Bajo ($15,000-$25,000)', 'Medio ($25,000-$40,000)', 'Medio-Alto ($40,000-$60,000)', 'Alto (> $60,000)'],
    required: true
  },
  {
    id: 'shopping_behavior',
    name: 'Comportamiento de Compra',
    description: 'Frecuencia y estilo de compra de productos de consumo masivo',
    type: 'select',
    options: ['Comprador planificado', 'Comprador impulsivo', 'Cazador de ofertas', 'Leal a marcas', 'Experimentador'],
    required: true
  },
  {
    id: 'brand_consciousness',
    name: 'Conciencia de Marca',
    description: 'Importancia que le da a las marcas reconocidas',
    type: 'select',
    options: ['Muy alta', 'Alta', 'Media', 'Baja', 'Muy baja'],
    required: true
  },
  {
    id: 'price_sensitivity',
    name: 'Sensibilidad al Precio',
    description: 'Qué tan sensible es a cambios en precios',
    type: 'select',
    options: ['Muy sensible', 'Sensible', 'Moderada', 'Poco sensible', 'Insensible'],
    required: true
  },
  {
    id: 'innovation_adoption',
    name: 'Adopción de Innovación',
    description: 'Tendencia a probar productos nuevos',
    type: 'select',
    options: ['Innovador temprano', 'Adoptador temprano', 'Mayoría temprana', 'Mayoría tardía', 'Rezagado'],
    required: false
  }
];

export const PersonaVariableConfig: React.FC<PersonaVariableConfigProps> = ({
  variables,
  onVariablesChange
}) => {
  const [editingVariable, setEditingVariable] = useState<PersonaVariable | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const addNewVariable = () => {
    const newVariable: PersonaVariable = {
      id: `var_${Date.now()}`,
      name: '',
      description: '',
      type: 'text',
      required: false
    };
    setEditingVariable(newVariable);
    setIsAddingNew(true);
  };

  const saveVariable = (variable: PersonaVariable) => {
    if (isAddingNew) {
      onVariablesChange([...variables, variable]);
      setIsAddingNew(false);
    } else {
      onVariablesChange(variables.map(v => v.id === variable.id ? variable : v));
    }
    setEditingVariable(null);
  };

  const deleteVariable = (id: string) => {
    onVariablesChange(variables.filter(v => v.id !== id));
  };

  const resetToDefaults = () => {
    onVariablesChange(DEFAULT_VARIABLES);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Variables de Personas Sintéticas
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Restaurar Defaults
          </button>
          <button
            onClick={addNewVariable}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Variable
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {variables.map((variable) => (
          <VariableItem
            key={variable.id}
            variable={variable}
            isEditing={editingVariable?.id === variable.id}
            onEdit={() => setEditingVariable(variable)}
            onSave={saveVariable}
            onCancel={() => setEditingVariable(null)}
            onDelete={() => deleteVariable(variable.id)}
          />
        ))}

        {editingVariable && isAddingNew && (
          <VariableItem
            variable={editingVariable}
            isEditing={true}
            onEdit={() => {}}
            onSave={saveVariable}
            onCancel={() => {
              setEditingVariable(null);
              setIsAddingNew(false);
            }}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
};

interface VariableItemProps {
  variable: PersonaVariable;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (variable: PersonaVariable) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  const [editedVariable, setEditedVariable] = useState(variable);

  const handleSave = () => {
    if (editedVariable.name.trim()) {
      onSave(editedVariable);
    }
  };

  const addOption = () => {
    setEditedVariable({
      ...editedVariable,
      options: [...(editedVariable.options || []), '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editedVariable.options || [])];
    newOptions[index] = value;
    setEditedVariable({
      ...editedVariable,
      options: newOptions
    });
  };

  const removeOption = (index: number) => {
    setEditedVariable({
      ...editedVariable,
      options: editedVariable.options?.filter((_, i) => i !== index)
    });
  };

  if (isEditing) {
    return (
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Variable
            </label>
            <input
              type="text"
              value={editedVariable.name}
              onChange={(e) => setEditedVariable({...editedVariable, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ej. Estilo de Vida"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Dato
            </label>
            <select
              value={editedVariable.type}
              onChange={(e) => setEditedVariable({...editedVariable, type: e.target.value as PersonaVariable['type']})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="select">Selección</option>
              <option value="boolean">Sí/No</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={editedVariable.description}
            onChange={(e) => setEditedVariable({...editedVariable, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Describe qué información captura esta variable"
          />
        </div>

        {editedVariable.type === 'select' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opciones de Selección
            </label>
            <div className="space-y-2">
              {editedVariable.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Opción ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus className="h-4 w-4" />
                Agregar Opción
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedVariable.required}
              onChange={(e) => setEditedVariable({...editedVariable, required: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Requerido</span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!editedVariable.name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{variable.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              variable.required 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {variable.required ? 'Requerido' : 'Opcional'}
            </span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {variable.type === 'text' ? 'Texto' :
               variable.type === 'number' ? 'Número' :
               variable.type === 'select' ? 'Selección' : 'Sí/No'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{variable.description}</p>
          {variable.options && variable.options.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {variable.options.map((option, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};