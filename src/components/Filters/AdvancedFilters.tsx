// components/Filters/AdvancedFilters.tsx - Filtros avanzados para búsqueda RAG Enterprise

import React, { useState } from 'react';
import { Filter, Calendar, MapPin, BookOpen, TrendingUp, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterState {
  regions: string[];
  years: number[];
  methodologies: string[];
  studyTypes: string[];
  minConfidence: number;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  className 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    years: [],
    methodologies: [],
    studyTypes: [],
    minConfidence: 0
  });

  // Opciones disponibles basadas en metadata hondureña
  const availableRegions = [
    'Nacional',
    'Tegucigalpa',
    'San Pedro Sula',
    'Zona Norte',
    'Zona Sur',
    'Zona Oriental',
    'Zona Occidental',
    'Región Central'
  ];

  const availableYears = [2024, 2023, 2022, 2021, 2020, 2019];
  
  const availableMethodologies = [
    'Cuantitativo',
    'Cualitativo'
  ];

  const availableStudyTypes = [
    'Tracking Publicitario',
    'Concept Test',
    'MaxDiff',
    'Brand Health',
    'Segmentación',
    'Usage & Attitudes',
    'Eye Tracking',
    'General Research'
  ];

  const toggleArrayFilter = (category: keyof FilterState, value: any) => {
    setFilters(prev => {
      const currentValues = prev[category] as any[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [category]: newValues
      };
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      regions: [],
      years: [],
      methodologies: [],
      studyTypes: [],
      minConfidence: 0
    });
  };

  const hasActiveFilters = () => {
    return filters.regions.length > 0 || 
           filters.years.length > 0 || 
           filters.methodologies.length > 0 ||
           filters.studyTypes.length > 0 ||
           filters.minConfidence > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Filtros Avanzados de Búsqueda
              </h2>
              <p className="text-sm text-gray-600">
                Refina los resultados según región, período y metodología
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
          {/* Regiones - Temporalmente oculto */}
          {false && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Regiones</h3>
              {filters.regions.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.regions.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableRegions.map(region => (
                <button
                  key={region}
                  onClick={() => toggleArrayFilter('regions', region)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors",
                    filters.regions.includes(region)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Años */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Período</h3>
              {filters.years.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.years.length} años
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => toggleArrayFilter('years', year)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors",
                    filters.years.includes(year)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Metodologías */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Metodología</h3>
              {filters.methodologies.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.methodologies.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableMethodologies.map(methodology => (
                <button
                  key={methodology}
                  onClick={() => toggleArrayFilter('methodologies', methodology)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.methodologies.includes(methodology)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {methodology}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Estudio */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Tipo de Estudio</h3>
              {filters.studyTypes.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.studyTypes.length} seleccionados
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableStudyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('studyTypes', type)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.studyTypes.includes(type)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>


          {/* Resumen de Filtros Activos */}
          {hasActiveFilters() && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">
                  Filtros Activos
                </h4>
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Limpiar todo
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.regions.map(region => (
                  <span key={region} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                    <MapPin className="h-3 w-3" />
                    {region}
                    <button
                      onClick={() => toggleArrayFilter('regions', region)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.years.map(year => (
                  <span key={year} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                    <Calendar className="h-3 w-3" />
                    {year}
                    <button
                      onClick={() => toggleArrayFilter('years', year)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {hasActiveFilters() 
              ? `${Object.values(filters).flat().filter(v => v).length} filtros aplicados`
              : 'Sin filtros aplicados'
            }
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;