// components/Analytics/DashboardModule.tsx - Dashboard Ejecutivo con métricas en tiempo real

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

const DashboardModule: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Métricas simuladas
  const [metrics] = useState<Metric[]>([
    {
      id: 'campaigns',
      label: 'Campañas Evaluadas',
      value: 127,
      change: +12.5,
      trend: 'up',
      icon: Target,
      color: 'orange'
    },
    {
      id: 'roi',
      label: 'ROI Promedio',
      value: '340%',
      change: +23.1,
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'users',
      label: 'Usuarios Activos',
      value: 45,
      change: +8.2,
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'accuracy',
      label: 'Precisión ML',
      value: '94.7%',
      change: +2.3,
      trend: 'up',
      icon: Activity,
      color: 'purple'
    }
  ]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular llamada API
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 2000);
  };

  const handleExport = () => {
    // Simular exportación de datos
    alert('Exportando dashboard... Esta funcionalidad se completará próximamente.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Dashboard Ejecutivo
                  </h1>
                  <p className="text-sm text-gray-600">
                    Métricas y análisis en tiempo real
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Last Updated */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Última actualización: {lastUpdated.toLocaleString('es-HN')}
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  metric.color === 'orange' && "bg-orange-100",
                  metric.color === 'green' && "bg-green-100",
                  metric.color === 'blue' && "bg-blue-100",
                  metric.color === 'purple' && "bg-purple-100"
                )}>
                  <metric.icon className={cn(
                    "h-5 w-5",
                    metric.color === 'orange' && "text-orange-600",
                    metric.color === 'green' && "text-green-600",
                    metric.color === 'blue' && "text-blue-600",
                    metric.color === 'purple' && "text-purple-600"
                  )} />
                </div>
                
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  metric.trend === 'up' && "text-green-600",
                  metric.trend === 'down' && "text-red-600",
                  metric.trend === 'stable' && "text-gray-600"
                )}>
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    metric.trend === 'down' && "rotate-180"
                  )} />
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ROI por Campaña
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Gráfico interactivo próximamente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Engagement por Segmento
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Heatmap interactivo próximamente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              'Nueva campaña "Tigo 5G Pro" evaluada con 85% de éxito predicho',
              'Focus Group completado para concepto "Familia Conectada"',
              'Reporte automático generado para Q1 2025',
              'Predicción ML actualizada con 94.7% de precisión'
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{activity}</p>
                <span className="text-xs text-gray-400 ml-auto">
                  Hace {Math.floor(Math.random() * 60)} min
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">🚀 Próximamente</h3>
          <p className="text-orange-100">
            Gráficos interactivos, reportes personalizados, alertas inteligentes y mucho más.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardModule;