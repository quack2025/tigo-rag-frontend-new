// App.tsx - Componente principal de la aplicación

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import LoginPage from './components/Auth/LoginPage';
import ModuleSelector from './components/Landing/ModuleSelector';
import GeneralModule from './components/Modules/GeneralModule';
import CreativeModule from './components/Modules/CreativeModule';
import SyntheticModule from './components/Modules/SyntheticModule';
import DashboardModule from './components/Analytics/DashboardModule';
import PredictorModule from './components/ML/PredictorModule';
import ReportsModule from './components/Reports/ReportsModule';
import { cn } from './lib/utils';

// Componente de ruta protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente de ruta pública (solo para no autenticados)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Log de inicialización
    console.log('🚀 RAG Frontend iniciado');
    console.log('🔐 Usuario autenticado:', isAuthenticated());
    
    // Configurar título de la página
    document.title = 'RAG System';
    
    // Agregar clase al body para estilos globales
    document.body.classList.add('rag-app');
    
    return () => {
      document.body.classList.remove('rag-app');
    };
  }, [isAuthenticated]);

  return (
    <div className={cn('min-h-screen bg-gray-50 font-sans antialiased')}>
      <Router>
        <Routes>
          {/* Ruta principal - Selector de módulos para usuarios autenticados */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? (
                <ProtectedRoute>
                  <ModuleSelector />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Rutas públicas */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Rutas protegidas - Módulos individuales */}
          <Route 
            path="/general" 
            element={
              <ProtectedRoute>
                <GeneralModule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/creative" 
            element={
              <ProtectedRoute>
                <CreativeModule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/synthetic" 
            element={
              <ProtectedRoute>
                <SyntheticModule />
              </ProtectedRoute>
            } 
          />
          
          {/* Nuevos módulos Analytics y ML */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardModule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/predictor" 
            element={
              <ProtectedRoute>
                <PredictorModule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <ReportsModule />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta legacy para retrocompatibilidad - redirige al selector */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            } 
          />
          
          {/* Callback para magic link (futuro) */}
          <Route 
            path="/auth/callback" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Página 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Página no encontrada</p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Volver atrás
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
      
      {/* Debug info en desarrollo */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>ENV: {import.meta.env.MODE}</div>
          <div>AUTH: {isAuthenticated() ? '✅' : '❌'}</div>
          <div>API: {import.meta.env.VITE_API_URL || 'http://localhost:8000'}</div>
        </div>
      )}
    </div>
  );
};

export default App;
