// components/Campaign/ConceptForm.tsx - Formulario para crear conceptos/campañas

import React, { useState } from 'react';
import { 
  Plus, Minus, Save, Lightbulb, DollarSign, 
  Megaphone, Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CampaignConcept } from '../../types/campaign.types';
import { CONCEPT_TEMPLATES } from '../../types/campaign.types';

interface ConceptFormProps {
  onSave: (concept: CampaignConcept) => void;
  onCancel: () => void;
  initialConcept?: Partial<CampaignConcept>;
}

const ConceptForm: React.FC<ConceptFormProps> = ({ 
  onSave, 
  onCancel, 
  initialConcept 
}) => {
  const [concept, setConcept] = useState<Partial<CampaignConcept>>({
    type: 'product_concept',
    name: '',
    description: '',
    benefits: ['', '', ''],
    differentiation: '',
    monthly_price: undefined,
    target_audience: '',
    channel: 'digital',
    tone: 'informal',
    call_to_action: '',
    visual_elements: [],
    technical_specs: {},
    ...initialConcept
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!concept.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!concept.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!concept.benefits?.some(b => b.trim())) {
      newErrors.benefits = 'Al menos un beneficio es requerido';
    }

    if (!concept.differentiation?.trim()) {
      newErrors.differentiation = 'La diferenciación es requerida';
    }

    if (!concept.target_audience?.trim()) {
      newErrors.target_audience = 'El público objetivo es requerido';
    }

    if (!concept.call_to_action?.trim()) {
      newErrors.call_to_action = 'El call to action es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const finalConcept: CampaignConcept = {
      id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: concept.type || 'product_concept',
      name: concept.name!,
      description: concept.description!,
      benefits: concept.benefits?.filter(b => b.trim()) || [],
      differentiation: concept.differentiation!,
      monthly_price: concept.monthly_price,
      target_audience: concept.target_audience!,
      channel: concept.channel || 'digital',
      tone: concept.tone || 'informal',
      call_to_action: concept.call_to_action!,
      visual_elements: concept.visual_elements || [],
      technical_specs: concept.technical_specs || {},
      created_at: new Date(),
      updated_at: new Date()
    };

    onSave(finalConcept);
  };

  const loadTemplate = (type: 'product_concept' | 'campaign') => {
    const template = CONCEPT_TEMPLATES[type];
    setConcept(prev => ({
      ...prev,
      type,
      ...template
    }));
  };

  const addBenefit = () => {
    setConcept(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }));
  };

  const removeBenefit = (index: number) => {
    setConcept(prev => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index) || []
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setConcept(prev => ({
      ...prev,
      benefits: prev.benefits?.map((b, i) => i === index ? value : b) || []
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-white" />
          <div>
            <h2 className="text-xl font-semibold text-white">
              {concept.type === 'campaign' ? 'Nueva Campaña de Comunicación' : 'Nuevo Concepto de Producto'}
            </h2>
            <p className="text-emerald-100 text-sm">
              Ingresa los detalles para evaluar con los arquetipos hondureños
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tipo de concepto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de evaluación
          </label>
          <div className="flex gap-4">
            {[
              { value: 'product_concept', label: 'Concepto de Producto', icon: Settings },
              { value: 'campaign', label: 'Campaña de Comunicación', icon: Megaphone }
            ].map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={cn(
                  'flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors',
                  concept.type === value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={concept.type === value}
                  onChange={(e) => {
                    setConcept(prev => ({ ...prev, type: e.target.value as any }));
                    loadTemplate(e.target.value as any);
                  }}
                  className="sr-only"
                />
                <Icon className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-gray-900">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Información básica */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={concept.name || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, name: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                  errors.name ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder={concept.type === 'campaign' ? 'ej. "Tigo Más Cerca"' : 'ej. "Tigo 5G Pro"'}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público Objetivo *
              </label>
              <input
                type="text"
                value={concept.target_audience || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, target_audience: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                  errors.target_audience ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="ej. Profesionales de 25-45 años"
              />
              {errors.target_audience && <p className="text-red-600 text-xs mt-1">{errors.target_audience}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={concept.description || ''}
              onChange={(e) => setConcept(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none",
                errors.description ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder={concept.type === 'campaign' 
                ? 'Describe el mensaje principal y enfoque de la campaña...'
                : 'Describe qué es el producto, cómo funciona y para qué sirve...'
              }
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Beneficios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficios Principales *
            </label>
            <div className="space-y-2">
              {concept.benefits?.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={`Beneficio ${index + 1}`}
                  />
                  {(concept.benefits?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefit}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 text-sm"
              >
                <Plus className="h-4 w-4" />
                Agregar beneficio
              </button>
            </div>
            {errors.benefits && <p className="text-red-600 text-xs mt-1">{errors.benefits}</p>}
          </div>

          {/* Diferenciación y Precio */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diferenciación *
              </label>
              <textarea
                value={concept.differentiation || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, differentiation: e.target.value }))}
                rows={3}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none",
                  errors.differentiation ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="¿Qué hace único este producto/campaña vs la competencia?"
              />
              {errors.differentiation && <p className="text-red-600 text-xs mt-1">{errors.differentiation}</p>}
            </div>

            {concept.type === 'product_concept' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Mensual
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={concept.monthly_price || ''}
                    onChange={(e) => setConcept(prev => ({ ...prev, monthly_price: parseFloat(e.target.value) || undefined }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Lempiras"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Canal y Tono */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal Principal
              </label>
              <select
                value={concept.channel || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, channel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="digital">Digital/Redes Sociales</option>
                <option value="tv">Televisión</option>
                <option value="radio">Radio</option>
                <option value="outdoor">Vallas/Exterior</option>
                <option value="print">Medios Impresos</option>
                <option value="punto_venta">Punto de Venta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono de Comunicación
              </label>
              <select
                value={concept.tone || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, tone: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="formal">Formal/Corporativo</option>
                <option value="informal">Informal/Casual</option>
                <option value="emocional">Emocional/Inspirador</option>
                <option value="técnico">Técnico/Educativo</option>
                <option value="divertido">Divertido/Humor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action *
              </label>
              <input
                type="text"
                value={concept.call_to_action || ''}
                onChange={(e) => setConcept(prev => ({ ...prev, call_to_action: e.target.value }))}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
                  errors.call_to_action ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="ej. ¡Cámbiateya a Tigo!"
              />
              {errors.call_to_action && <p className="text-red-600 text-xs mt-1">{errors.call_to_action}</p>}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar y Evaluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptForm;