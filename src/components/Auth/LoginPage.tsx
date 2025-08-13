// components/Auth/LoginPage.tsx - Página de login segura

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface LoginPageProps {
  className?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Verificar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/chat', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await login(email, password);
      
      if (response.success) {
        setSuccess('¡Login exitoso! Redirigiendo...');
        setTimeout(() => {
          navigate('/chat', { replace: true });
        }, 1000);
      } else {
        setError(response.message || 'Credenciales inválidas');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4', className)}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            RAG System
          </h2>
          <p className="text-gray-600">
            Sistema de análisis de mercado con IA
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin, user, o tigo"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={cn(
                'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center',
                (isLoading || !email || !password) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Zap className="-ml-1 mr-3 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">Credenciales de prueba:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>admin</strong> / admin123</div>
              <div><strong>user</strong> / user123</div>
              <div><strong>tigo</strong> / tigo2024</div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Conexión segura · Datos confidenciales protegidos
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Sistema RAG v1.0</p>
          <p className="mt-1">Solo personal autorizado</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;