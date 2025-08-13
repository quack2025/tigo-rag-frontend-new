// components/Config/ConfigurationPanel.tsx - Panel de configuración avanzada

import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Download, AlertCircle, CheckCircle } from 'lucide-react';
import type { ConfigOption } from '../../types';
import { cn } from '../../lib/utils';

interface ConfigurationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ isOpen, onClose }) => {
  const [configs, setConfigs] = useState<ConfigOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Configuraciones por defecto disponibles
  const defaultConfigs: ConfigOption[] = [
    {
      id: 'system_prompt_general',
      name: 'Prompt del Sistema (General)',
      description: 'Prompt base para el modo General',
      type: 'text',
      value: 'Eres un asistente especializado en análisis de mercado para Tigo Honduras. Proporciona respuestas precisas basadas únicamente en los datos disponibles.'
    },
    {
      id: 'system_prompt_creative',
      name: 'Prompt del Sistema (Creativo)',
      description: 'Prompt base para el modo Creativo',
      type: 'text',
      value: 'Eres un consultor estratégico creativo para Tigo Honduras. Genera insights innovadores y visualizaciones basadas en los datos, incluyendo recomendaciones estratégicas.'
    },
    {
      id: 'rag_percentage_general',
      name: 'Porcentaje RAG (General)',
      description: 'Porcentaje de información basada en documentos vs conocimiento del modelo',
      type: 'number',
      value: 90,
      min: 0,
      max: 100
    },
    {
      id: 'rag_percentage_creative',
      name: 'Porcentaje RAG (Creativo)',
      description: 'Porcentaje de información basada en documentos vs creatividad del modelo',
      type: 'number',
      value: 70,
      min: 0,
      max: 100
    },
    {
      id: 'creativity_level',
      name: 'Nivel de Creatividad',
      description: 'Nivel de creatividad en las respuestas (0.0 = conservador, 1.0 = muy creativo)',
      type: 'number',
      value: 0.7,
      min: 0,
      max: 1
    },
    {
      id: 'max_context_chunks',
      name: 'Máximo de Chunks de Contexto',
      description: 'Número máximo de fragmentos de documento a usar como contexto',
      type: 'number',
      value: 5,
      min: 1,
      max: 20
    },
    {
      id: 'enable_visualizations',
      name: 'Habilitar Visualizaciones',
      description: 'Permitir generación automática de gráficos y tablas',
      type: 'boolean',
      value: true
    },
    {
      id: 'response_language',
      name: 'Idioma de Respuesta',
      description: 'Idioma predeterminado para las respuestas',
      type: 'select',
      value: 'español',
      options: [
        { label: 'Español', value: 'español' },
        { label: 'English', value: 'english' },
        { label: 'Español Hondureño', value: 'español_honduras' }
      ]
    }
  ];

  const presets = [
    { value: 'conservative', label: 'Conservador', description: 'Respuestas basadas principalmente en datos' },
    { value: 'balanced', label: 'Equilibrado', description: 'Balance entre datos e insights' },
    { value: 'creative', label: 'Creativo', description: 'Mayor creatividad e innovación' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadConfiguration();
    }
  }, [isOpen]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      // Cargar configuración desde el backend o usar valores por defecto
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/config/parameters`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`
        }
      });

      if (response.ok) {
        const backendConfigs = await response.json();
        // Merge con configuraciones por defecto si la API no está disponible
        setConfigs(backendConfigs.parameters || defaultConfigs);
      } else {
        // Usar configuraciones por defecto si el backend no responde
        setConfigs(defaultConfigs);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      setConfigs(defaultConfigs);
    }
    setLoading(false);
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/config/user/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`
        },
        body: JSON.stringify({
          user_id: 'current_user',
          config_changes: configs.reduce((acc, config) => {
            acc[config.id] = config.value;
            return acc;
          }, {} as any)
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        
        // También guardar localmente como respaldo
        localStorage.setItem('tigo_config_backup', JSON.stringify(configs));
      } else {
        throw new Error('Error saving to backend');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Guardar localmente si el backend falla
      localStorage.setItem('tigo_config_backup', JSON.stringify(configs));
      setMessage({ type: 'success', text: 'Configuración guardada localmente' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const applyPreset = async (presetName: string) => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/config/preset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`
        },
        body: JSON.stringify({
          preset_name: presetName
        })
      });

      if (response.ok) {
        await loadConfiguration(); // Recargar configuración
        setMessage({ type: 'success', text: `Preset "${presetName}" aplicado exitosamente` });
      } else {
        throw new Error('Error applying preset');
      }
    } catch (error) {
      console.error('Error applying preset:', error);
      setMessage({ type: 'error', text: 'Error aplicando preset' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const resetToDefaults = () => {
    setConfigs(defaultConfigs);
    setMessage({ type: 'success', text: 'Configuración restaurada a valores por defecto' });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportConfiguration = () => {
    const configData = {
      exported_at: new Date().toISOString(),
      version: '1.0',
      configurations: configs
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tigo-rag-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateConfig = (id: string, value: any) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, value } : config
    ));
  };

  const renderConfigField = (config: ConfigOption) => {
    switch (config.type) {
      case 'text':
        return (
          <textarea
            value={config.value}
            onChange={(e) => updateConfig(config.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
            placeholder={config.description}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={config.value}
            onChange={(e) => updateConfig(config.id, parseFloat(e.target.value) || 0)}
            min={config.min}
            max={config.max}
            step={config.max && config.max <= 1 ? 0.1 : 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.value}
              onChange={(e) => updateConfig(config.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {config.value ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </label>
        );

      case 'select':
        return (
          <select
            value={config.value}
            onChange={(e) => updateConfig(config.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración del Sistema RAG
              </h2>
              <p className="text-sm text-gray-600">
                Personaliza el comportamiento del sistema de inteligencia artificial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Message */}
          {message && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg',
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            )}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          {/* Presets */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Presets de Configuración</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => applyPreset(preset.value)}
                  disabled={saving}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{preset.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Fields */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Configuración Detallada</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando configuración...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {configs.map((config) => (
                  <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        {config.name}
                      </label>
                      <p className="text-xs text-gray-600">{config.description}</p>
                    </div>
                    {renderConfigField(config)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={exportConfiguration}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Restablecer
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={saveConfiguration}
              disabled={saving}
              className={cn(
                'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                saving && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;