// components/Chat/ChatPage.tsx - Página principal de chat RAG

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LogOut, Bot, Settings, Trash2, BarChart3, Filter, Search, Users } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import type { ChatMode } from '../../lib/chatStorage';
import MarkdownRenderer from './MarkdownRenderer';
import CitationsList from './CitationsList';
import ConfigurationPanel from '../Config/ConfigurationPanel';
import AdvancedFilters from '../Filters/AdvancedFilters';
import ChatHistorySearch from '../Search/ChatHistorySearch';
import AdvancedPersonaManager from '../Personas/AdvancedPersonaManager';
import FocusGroupSimulator from '../Personas/FocusGroupSimulator';

interface ChatPageProps {
  className?: string;
}

// ChatMessage interface moved to types/index.ts

const ChatPage: React.FC<ChatPageProps> = ({ className }) => {
  // Hooks
  const navigate = useNavigate();
  const { logout, getUser, isAuthenticated } = useAuth();
  
  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>('general');
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);
  const [showFocusGroup, setShowFocusGroup] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [activePersona, setActivePersona] = useState<any>(null);
  const [syntheticPersonas, setSyntheticPersonas] = useState<any[]>([]);
  
  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Usuario actual
  const user = getUser();

  // Efectos
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar mensajes cuando cambie el modo
  useEffect(() => {
    const savedMessages = chatStorage.getMessages(currentMode);
    setMessages(savedMessages);
  }, [currentMode]);

  // Funciones
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };
    
    const updatedMessages = chatStorage.addMessage(currentMode, newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    // Agregar mensaje del usuario
    addMessage({
      role: 'user',
      content: userMessage,
      mode: currentMode,
    });
    
    // Agregar mensaje del asistente
    addMessage({
      role: 'assistant',
      content: 'Procesando tu consulta...',
      mode: currentMode,
    });
    
    setIsLoading(true);
    
    try {
      console.log(`💬 Sending message in ${currentMode} mode:`, userMessage);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          mode: currentMode,
          filters: activeFilters,
          persona: activePersona,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: RAGResponse = await response.json();
      
      // Actualizar último mensaje con la respuesta completa
      const updates: Partial<ChatMessage> = {
        content: data.answer || data.content || 'Respuesta recibida',
        citations: data.citations || [],
        metadata: data.metadata || {}
      };

      if (data.visualization) {
        updates.visualization = data.visualization;
      }

      const updatedMessages = chatStorage.updateLastMessage(currentMode, updates);
      setMessages(updatedMessages);
      
      console.log('✅ Message processed successfully');
    } catch (error: any) {
      console.error('❌ Chat error:', error);
      
      const errorMessage = 'Error de conexión. Asegúrate de que el backend esté ejecutándose en http://localhost:8000';
      
      // Actualizar último mensaje con error
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: errorMessage,
          };
        }
        return newMessages;
      });
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCurrentChat = () => {
    const modeName = currentMode === 'general' ? 'General' : 'Creativo';
    if (window.confirm(`¿Estás seguro que deseas limpiar el chat ${modeName}?`)) {
      chatStorage.clearMessages(currentMode);
      setMessages([]);
    }
  };

  const handleModeChange = (newMode: ChatMode) => {
    setCurrentMode(newMode);
    setError(null);
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };


  return (
    <div className={cn('h-screen flex flex-col bg-gray-50', className)}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Tigo RAG System
              </h1>
              <p className="text-sm text-gray-500">
                Bienvenido, {user?.username || 'Usuario'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mode Selector with Stats */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['general', 'creative'] as ChatMode[]).map((mode) => {
                const stats = chatStorage.getStats(mode);
                const isActive = currentMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    disabled={isLoading}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2',
                      isActive
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {mode === 'general' ? (
                      <>
                        <Bot className="h-4 w-4" />
                        General
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4" />
                        Creativo
                      </>
                    )}
                    {stats.total > 0 && (
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        isActive 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-600'
                      )}>
                        {stats.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <button
              onClick={() => setShowPersonas(true)}
              className={cn(
                "p-2 border rounded-lg transition-colors",
                activePersona
                  ? "text-purple-600 border-purple-300 bg-purple-50 hover:bg-purple-100"
                  : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
              )}
              title="Personas sintéticas"
            >
              <Users className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Buscar en historial"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFilters(true)}
                className={cn(
                  "p-2 border rounded-lg transition-colors",
                  activeFilters 
                    ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                )}
                title="Filtros avanzados"
              >
                <Filter className="h-4 w-4" />
              </button>
              {activeFilters && Object.values(activeFilters).flat().filter(v => v).length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">
                    {Object.values(activeFilters).flat().filter(v => v).length}
                  </span>
                </span>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearCurrentChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={`Limpiar chat ${currentMode === 'general' ? 'General' : 'Creativo'}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Configuración"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        
        {/* Active Persona Indicator */}
        {activePersona && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                Conversando con <strong>{activePersona.name}</strong> ({activePersona.segment})
              </span>
            </div>
            <button
              onClick={() => setActivePersona(null)}
              className="text-purple-600 hover:text-purple-800 text-xs font-medium"
            >
              Desactivar
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Hola! ¿En qué puedo ayudarte hoy?
            </h3>
            <p className="text-gray-600 mb-6">
              {currentMode === 'creative' 
                ? 'Modo creativo: Genera visualizaciones y análisis creativos'
                : 'Modo general: Respuestas directas basadas en datos'
              }
            </p>
            
            {/* Suggested Questions */}
            <div className="text-left max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
                💡 Preguntas sugeridas:
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  '¿Cuál es la percepción de marca de Tigo en Honduras?',
                  '¿Cómo se compara Tigo con la competencia?',
                  'Muéstrame datos de participación de mercado',
                  '¿Qué dicen los estudios sobre la cobertura de Tigo?',
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  {message.role === 'assistant' ? (
                    <div>
                      <MarkdownRenderer content={message.content} />
                      {message.citations && message.citations.length > 0 && (
                        <CitationsList citations={message.citations} />
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  
                  <div className={`text-xs mt-2 flex items-center justify-between ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === 'assistant' && message.metadata && (
                      <div className="flex items-center gap-2">
                        {message.metadata.processing_time_seconds && (
                          <span>⏱️ {message.metadata.processing_time_seconds}s</span>
                        )}
                        {message.metadata.chunks_retrieved && (
                          <span>📄 {message.metadata.chunks_retrieved} docs</span>
                        )}
                        {message.metadata.confidence && (
                          <span>🎯 {Math.round(message.metadata.confidence * 100)}%</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm text-gray-500">
                      Analizando información...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentMode === 'creative' 
                  ? "Describe tu idea o pregunta creativa..."
                  : "Haz una pregunta específica..."
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              maxLength={5000}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2',
                (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Send className="h-4 w-4" />
              Enviar
            </button>
          </div>
          
          {/* Character Counter */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>
              💡 Usa preguntas específicas para mejores resultados
            </span>
            <span>
              {input.length}/5000
            </span>
          </div>
        </form>
      </div>

      {/* Configuration Panel */}
      <ConfigurationPanel isOpen={showConfig} onClose={() => setShowConfig(false)} />
      
      {/* Advanced Filters */}
      <AdvancedFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters);
          setShowFilters(false);
        }}
      />

      {/* Chat History Search */}
      <ChatHistorySearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectMessage={(_, mode) => {
          // Cambiar al modo correcto y mostrar el mensaje
          setCurrentMode(mode as ChatMode);
          // Podríamos hacer scroll al mensaje específico si está en el historial actual
        }}
      />

      {/* Advanced Persona Manager */}
      <AdvancedPersonaManager
        isOpen={showPersonas}
        onClose={() => setShowPersonas(false)}
        onSelectPersona={(persona) => {
          setActivePersona(persona);
          setShowPersonas(false);
          // Mensaje enriquecido con contexto hondureño y role prompting
          const background = `🎭 **${persona.name}** de ${persona.location.city}, ${persona.location.department}

**Perfil**: ${persona.characteristics.demographics.age} años, ${persona.characteristics.demographics.gender === 'female' ? 'mujer' : 'hombre'}, ${persona.characteristics.demographics.marital_status === 'married' ? 'casado(a)' : 'soltero(a)'}
**Ocupación**: ${persona.characteristics.demographics.employment_status}
**NSE**: ${persona.characteristics.demographics.income_bracket}
**Plan actual**: ${persona.characteristics.telecom.plan_type} - L${persona.characteristics.telecom.monthly_spend}/mes
**Personalidad**: ${persona.conversation_style.dialect_markers.join(', ')} son palabras que usa frecuentemente

${persona.background.life_story}

Puedes preguntarle sobre:
- Su experiencia con Tigo vs competencia
- Problemas que enfrenta: ${persona.background.pain_points.join(', ')}
- Lo que más valora en un servicio móvil
- Su opinión sobre nuevos servicios o promociones`;

          addMessage({
            role: 'assistant',
            content: background,
            mode: currentMode,
          });
        }}
        onStartFocusGroup={(personas) => {
          setSyntheticPersonas(personas);
          setShowFocusGroup(true);
        }}
      />

      {/* Focus Group Simulator */}
      <FocusGroupSimulator
        isOpen={showFocusGroup}
        onClose={() => setShowFocusGroup(false)}
        personas={syntheticPersonas}
      />
    </div>
  );
};

export default ChatPage;