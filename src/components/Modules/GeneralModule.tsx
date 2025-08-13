// components/Modules/GeneralModule.tsx - Módulo RAG General

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bot, Send, Filter, Search, Download, Settings, 
  Trash2, BarChart3, FileText, Clock, Image, Paperclip, Sliders
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';
import AdvancedFilters from '../Filters/AdvancedFilters';
import ChatHistorySearch from '../Search/ChatHistorySearch';

const GeneralModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  
  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [pasteHint, setPasteHint] = useState(false);
  
  // Response customization settings
  const [responseSettings, setResponseSettings] = useState({
    extensionLevel: 'normal' as 'resumido' | 'normal' | 'detallado',
    responseStyle: 'ejecutivo' as 'ejecutivo' | 'tecnico' | 'comercial',
    enableVisualizations: true,
    detailLevel: 7,
    language: 'español' as 'español' | 'inglés',
    targetAudience: 'gerentes' as 'c-level' | 'gerentes' | 'analistas' | 'operativo',
    includeCitations: true,
    temporalContext: 'completo' as 'reciente' | 'completo',
    analysisType: 'descriptivo' as 'descriptivo' | 'predictivo' | 'comparativo',
    outputFormat: 'narrativo' as 'narrativo' | 'bullets' | 'reporte'
  });
  
  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    loadMessages();
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle paste events for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            // Check file size (10MB limit)
            if (file.size <= 10 * 1024 * 1024) {
              setAttachedFiles(prev => [...prev, file]);
              setPasteHint(true);
              setTimeout(() => setPasteHint(false), 2000);
            } else {
              alert('La imagen es demasiado grande. Máximo 10MB permitido.');
            }
          }
        }
      }
    };

    // Show paste hint when user has image in clipboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v') {
        setPasteHint(true);
        setTimeout(() => setPasteHint(false), 1000);
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('general');
    setMessages(savedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };
    
    const updatedMessages = chatStorage.addMessage('general', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isDoc = file.type.includes('document') || file.type.includes('text');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      return (isImage || isPDF || isDoc) && isValidSize;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    const hasFiles = attachedFiles.length > 0;
    setInput('');
    setError(null);
    
    // Agregar mensaje del usuario
    addMessage({
      role: 'user',
      content: userMessage,
      mode: 'general',
    });
    
    // Agregar mensaje del asistente
    addMessage({
      role: 'assistant',
      content: hasFiles ? 'Analizando documentos y archivos adjuntos...' : 'Analizando documentos...',
      mode: 'general',
    });
    
    setIsLoading(true);
    setAttachedFiles([]); // Clear files after sending
    
    try {
      let requestBody: string | FormData;
      let headers: Record<string, string> = {
        'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`,
      };

      // Build enhanced request with response customization
      const enhancedRequest = {
        text: userMessage,
        metadata_filter: activeFilters,
        output_types: responseSettings.enableVisualizations ? ["text", "table", "chart"] : ["text"],
        response_customization: {
          extension_level: responseSettings.extensionLevel,
          response_style: responseSettings.responseStyle,
          detail_level: responseSettings.detailLevel,
          language: responseSettings.language,
          target_audience: responseSettings.targetAudience,
          include_citations: responseSettings.includeCitations,
          temporal_context: responseSettings.temporalContext,
          analysis_type: responseSettings.analysisType,
          output_format: responseSettings.outputFormat
        }
      };

      if (hasFiles) {
        // Use FormData for multimodal requests
        const formData = new FormData();
        formData.append('text', userMessage);
        formData.append('metadata_filter', JSON.stringify(activeFilters));
        formData.append('output_types', JSON.stringify(responseSettings.enableVisualizations ? ["text", "table", "chart"] : ["text"]));
        formData.append('response_customization', JSON.stringify(enhancedRequest.response_customization));
        
        attachedFiles.forEach((file, index) => {
          formData.append(`images`, file);
        });
        
        requestBody = formData;
      } else {
        // Use JSON for text-only requests
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(enhancedRequest);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/rag-pure`, {
        method: 'POST',
        headers,
        body: requestBody,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: RAGResponse = await response.json();
      
      // Actualizar último mensaje con la respuesta completa
      const updates: Partial<ChatMessage> = {
        content: data.answer || data.content || 'Respuesta recibida',
        citations: data.citations || [],
        metadata: data.metadata || {},
        visualizations: data.visualizations || null,
        hasVisualizations: data.has_visualizations || false
      };

      const updatedMessages = chatStorage.updateLastMessage('general', updates);
      setMessages(updatedMessages);
      
    } catch (error: any) {
      console.error('❌ Chat error:', error);
      
      const errorMessage = 'Error de conexión. Asegúrate de que el backend esté ejecutándose en http://localhost:8000';
      
      const updatedMessages = chatStorage.updateLastMessage('general', {
        content: errorMessage,
      });
      setMessages(updatedMessages);
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar el chat?')) {
      chatStorage.clearMessages('general');
      setMessages([]);
    }
  };

  const exportConversation = () => {
    const data = {
      module: 'general',
      exported_at: new Date().toISOString(),
      user: user?.username,
      messages_count: messages.length,
      filters: activeFilters,
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tigo-rag-general-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  RAG General
                </h1>
                <p className="text-sm text-gray-500">
                  Análisis basado en datos • {user?.username || 'Usuario'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filters */}
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

            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Buscar en historial"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Export */}
            {messages.length > 0 && (
              <button
                onClick={exportConversation}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Exportar conversación"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            {/* Clear */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {/* Advanced Settings */}
            <div className="relative">
              <button
                onClick={() => setShowAdvancedSettings(true)}
                className={cn(
                  "p-2 border rounded-lg transition-colors",
                  (responseSettings.extensionLevel !== 'normal' || 
                   responseSettings.responseStyle !== 'ejecutivo' ||
                   !responseSettings.enableVisualizations ||
                   responseSettings.detailLevel !== 7 ||
                   responseSettings.language !== 'español' ||
                   responseSettings.targetAudience !== 'gerentes' ||
                   !responseSettings.includeCitations ||
                   responseSettings.temporalContext !== 'completo' ||
                   responseSettings.analysisType !== 'descriptivo' ||
                   responseSettings.outputFormat !== 'narrativo')
                    ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                )}
                title="Configuración avanzada de respuestas"
              >
                <Sliders className="h-4 w-4" />
              </button>
              {(responseSettings.extensionLevel !== 'normal' || 
                responseSettings.responseStyle !== 'ejecutivo' ||
                !responseSettings.enableVisualizations ||
                responseSettings.detailLevel !== 7 ||
                responseSettings.language !== 'español' ||
                responseSettings.targetAudience !== 'gerentes' ||
                !responseSettings.includeCitations ||
                responseSettings.temporalContext !== 'completo' ||
                responseSettings.analysisType !== 'descriptivo' ||
                responseSettings.outputFormat !== 'narrativo') && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
              )}
            </div>

            {/* Config */}
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Configuración del módulo"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">
                Filtros activos: {Object.values(activeFilters).flat().filter(v => v).length}
              </span>
            </div>
            <button
              onClick={() => setActiveFilters(null)}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              RAG General - Análisis Basado en Datos
            </h3>
            <p className="text-gray-600 mb-6">
              Realiza consultas específicas basadas en documentos de investigación de mercado
            </p>
            
            {/* Quick Actions */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {[
                '¿Cómo perciben los hondureños la marca Tigo vs la competencia?',
                'Análisis de satisfacción del servicio Tigo Home por región',
                'Efectividad de campañas publicitarias de Tigo en 2024',
                'Insights sobre adopción de servicios digitales en Honduras',
                'Evaluación de conceptos de productos Tigo más exitosos',
                'Tendencias de uso de telecomunicaciones por segmento demográfico'
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4 text-blue-600 mb-2" />
                  {question}
                </button>
              ))}
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
                      {message.visualizations && (
                        <div className="mt-4 space-y-4">
                          {Object.entries(message.visualizations).map(([type, charts]: [string, any]) => (
                            charts && Array.isArray(charts) && charts.map((chart: any, index: number) => (
                              <div key={`${type}-${index}`} className="p-4 bg-gray-50 rounded-lg border">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                                  {type.replace('_', ' ')} #{index + 1}
                                </h4>
                                {chart.description && (
                                  <p className="text-xs text-gray-600 mb-2">{chart.description}</p>
                                )}
                                <div className="bg-white p-3 rounded border">
                                  <pre className="text-xs text-gray-700 overflow-x-auto">
                                    {JSON.stringify(chart, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            ))
                          ))}
                        </div>
                      )}
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
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                    </span>
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
                      Analizando documentos...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          {/* Paste Hint */}
          {pasteHint && (
            <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
              <Image className="h-4 w-4" />
              ¡Imagen pegada exitosamente!
            </div>
          )}

          {/* Attached Files Display */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                  <Image className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 max-w-xs truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Haz una pregunta específica basada en datos..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              maxLength={5000}
            />
            
            {/* File Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Adjuntar archivos: Imágenes (JPG, PNG), documentos (PDF, DOC, TXT). Máximo 10MB por archivo"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </button>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Send className="h-4 w-4" />
              Analizar
            </button>
          </div>
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          {/* Stats */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3" />
                Modo General: Respuestas basadas en datos y documentos
              </span>
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                Archivos: JPG, PNG, PDF, DOC, TXT (máx. 10MB) • Ctrl+V para pegar imágenes
              </span>
            </div>
            <span>
              {input.length}/5000
            </span>
          </div>
        </form>
      </div>

      {/* Modals */}
      <AdvancedFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters);
          setShowFilters(false);
        }}
      />

      <ChatHistorySearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectMessage={() => {
          // Ya estamos en el modo correcto
        }}
      />

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Configuración RAG General
              </h2>
              <button
                onClick={() => setShowConfig(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Modo de Operación</h3>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">RAG General</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Respuestas basadas únicamente en documentos y datos. 
                      Ideal para consultas específicas con citas documentadas.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Capacidades</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Búsqueda semántica en documentos</li>
                    <li>• Citas y referencias automáticas</li>
                    <li>• Filtros avanzados por región/año/tipo</li>
                    <li>• Visualizaciones de datos</li>
                    <li>• Historial de conversaciones</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Para cambiar de modo, regresa al menú principal y selecciona otro módulo.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showAdvancedSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Sliders className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Configuración Avanzada de Respuestas
                  </h2>
                  <p className="text-sm text-gray-600">
                    Personaliza cómo el sistema genera las respuestas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdvancedSettings(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Extension Level */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Extensión de Respuesta</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['resumido', 'normal', 'detallado'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setResponseSettings(prev => ({ ...prev, extensionLevel: level }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.extensionLevel === level
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Style */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Estilo de Respuesta</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['ejecutivo', 'tecnico', 'comercial'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => setResponseSettings(prev => ({ ...prev, responseStyle: style }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.responseStyle === style
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Level Slider */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Nivel de Detalle: {responseSettings.detailLevel}/10
                </h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={responseSettings.detailLevel}
                  onChange={(e) => setResponseSettings(prev => ({ 
                    ...prev, 
                    detailLevel: parseInt(e.target.value) 
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Básico</span>
                  <span>Máximo</span>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Audiencia Objetivo</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['c-level', 'gerentes', 'analistas', 'operativo'] as const).map(audience => (
                    <button
                      key={audience}
                      onClick={() => setResponseSettings(prev => ({ ...prev, targetAudience: audience }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.targetAudience === audience
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {audience === 'c-level' ? 'C-Level' : audience}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Idioma de Respuesta</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['español', 'inglés'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setResponseSettings(prev => ({ ...prev, language: lang }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.language === lang
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tipo de Análisis</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['descriptivo', 'predictivo', 'comparativo'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setResponseSettings(prev => ({ ...prev, analysisType: type }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.analysisType === type
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Formato de Salida</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['narrativo', 'bullets', 'reporte'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setResponseSettings(prev => ({ ...prev, outputFormat: format }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.outputFormat === format
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {format === 'bullets' ? 'Bullet Points' : format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temporal Context */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Contexto Temporal</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['reciente', 'completo'] as const).map(context => (
                    <button
                      key={context}
                      onClick={() => setResponseSettings(prev => ({ ...prev, temporalContext: context }))}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg border transition-colors capitalize",
                        responseSettings.temporalContext === context
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      )}
                    >
                      {context === 'reciente' ? 'Solo Reciente (2023-2024)' : 'Histórico Completo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Incluir Visualizaciones</h3>
                    <p className="text-xs text-gray-500">Generar gráficos y tablas cuando sea relevante</p>
                  </div>
                  <button
                    onClick={() => setResponseSettings(prev => ({ 
                      ...prev, 
                      enableVisualizations: !prev.enableVisualizations 
                    }))}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      responseSettings.enableVisualizations ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        responseSettings.enableVisualizations ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Incluir Citas y Referencias</h3>
                    <p className="text-xs text-gray-500">Mostrar fuentes de información</p>
                  </div>
                  <button
                    onClick={() => setResponseSettings(prev => ({ 
                      ...prev, 
                      includeCitations: !prev.includeCitations 
                    }))}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      responseSettings.includeCitations ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        responseSettings.includeCitations ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Configuración personalizada aplicada
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setResponseSettings({
                    extensionLevel: 'normal',
                    responseStyle: 'ejecutivo',
                    enableVisualizations: true,
                    detailLevel: 7,
                    language: 'español',
                    targetAudience: 'gerentes',
                    includeCitations: true,
                    temporalContext: 'completo',
                    analysisType: 'descriptivo',
                    outputFormat: 'narrativo'
                  })}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Restablecer
                </button>
                <button
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Sliders className="h-4 w-4" />
                  Aplicar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralModule;