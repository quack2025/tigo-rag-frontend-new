// components/Modules/CreativeModule.tsx - Módulo RAG Creativo

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Palette, TrendingUp, Download, Settings, 
  Trash2, BarChart3, Lightbulb, Clock, Zap, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';

const CreativeModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  
  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativityLevel, setCreativityLevel] = useState(75);
  const [imageGenerationEnabled, setImageGenerationEnabled] = useState(false);
  const [dailyImageCount, setDailyImageCount] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Daily limits
  const DAILY_USER_LIMIT = 10;
  const DAILY_SYSTEM_LIMIT = 50;
  
  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  // Load daily image count on component mount
  useEffect(() => {
    loadDailyImageCount();
  }, []);

  const loadDailyImageCount = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`tigo_daily_images_${today}`);
    const count = stored ? parseInt(stored) : 0;
    setDailyImageCount(count);
  };

  const incrementImageCount = () => {
    const today = new Date().toDateString();
    const newCount = dailyImageCount + 1;
    setDailyImageCount(newCount);
    localStorage.setItem(`tigo_daily_images_${today}`, newCount.toString());
  };

  const canGenerateImage = () => {
    return dailyImageCount < DAILY_USER_LIMIT;
  };

  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('creative');
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
    
    const updatedMessages = chatStorage.addMessage('creative', newMessage);
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
      mode: 'creative',
    });
    
    // Agregar mensaje del asistente
    addMessage({
      role: 'assistant',
      content: 'Generando insights creativos...',
      mode: 'creative',
    });
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          mode: 'creative',
          creativity_level: creativityLevel / 100,
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
        metadata: data.metadata || {},
        visualization: data.visualization
      };

      const updatedMessages = chatStorage.updateLastMessage('creative', updates);
      setMessages(updatedMessages);
      
      // Auto-generate image if user requested one
      const imageKeywords = ['imagen', 'imágenes', 'visual', 'gráfico', 'diseño', 'foto', 'ilustración', 'banner', 'post', 'redes sociales', 'infografía'];
      const shouldGenerateImage = imageKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      if (shouldGenerateImage && canGenerateImage()) {
        // Add a message indicating image generation will start
        const imageNoticeMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: '🎨 Detecté que necesitas una imagen. Generando visual con DALL-E...',
          mode: 'creative',
          timestamp: new Date(),
        };
        
        const noticeMessages = chatStorage.addMessage('creative', imageNoticeMessage);
        setMessages(noticeMessages);
        
        // Generate a more specific prompt based on the response
        let imagePrompt = userMessage;
        
        // Extract key concepts from the response for better image generation
        if (userMessage.toLowerCase().includes('redes sociales')) {
          imagePrompt = `Crear un post profesional para redes sociales de Tigo Honduras con diseño moderno, colores azul (#1E40AF) y blanco, incluir el logo de Tigo, elementos de conectividad y señal móvil`;
        } else if (userMessage.toLowerCase().includes('campaña')) {
          imagePrompt = `Diseño de campaña publicitaria para Tigo Honduras con visual impactante, branding corporativo azul y blanco, elementos de tecnología y telecomunicaciones`;
        } else if (userMessage.toLowerCase().includes('infografía')) {
          imagePrompt = `Infografía profesional para Tigo Honduras con datos y estadísticas, diseño limpio y moderno en azul y blanco, iconos de telecomunicaciones`;
        }
        
        // Wait a moment for the text response to render, then generate image
        setTimeout(() => {
          generateImage(imagePrompt);
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('❌ Chat error:', error);
      
      const errorMessage = 'Error de conexión. Asegúrate de que el backend esté ejecutándose';
      
      const updatedMessages = chatStorage.updateLastMessage('creative', {
        content: errorMessage,
      });
      setMessages(updatedMessages);
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar el chat creativo?')) {
      chatStorage.clearMessages('creative');
      setMessages([]);
    }
  };

  const generateImage = async (prompt: string) => {
    if (!canGenerateImage()) {
      setError(`Has alcanzado el límite diario de ${DAILY_USER_LIMIT} imágenes. Intenta mañana.`);
      return;
    }

    setIsGeneratingImage(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tigo_auth_token')}`,
        },
        body: JSON.stringify({
          prompt: `${prompt}. Estilo profesional corporativo para Tigo Honduras, colores azul y blanco, alta calidad.`,
          size: "1024x1024",
          quality: "hd",
          style: "vivid",
          brand_context: "Tigo Honduras telecommunications"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.image_url) {
        // Add image message to chat
        const imageMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `🎨 **Imagen generada**: ${prompt}`,
          mode: 'creative',
          timestamp: new Date(),
          imageUrl: data.image_url,
          imagePrompt: prompt
        };

        const updatedMessages = chatStorage.addMessage('creative', imageMessage);
        setMessages(updatedMessages);
        
        // Increment daily count
        incrementImageCount();
      }

    } catch (error: any) {
      console.error('Error generando imagen:', error);
      setError('Error al generar la imagen. Intenta nuevamente.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const exportConversation = () => {
    const data = {
      module: 'creative',
      exported_at: new Date().toISOString(),
      user: user?.username,
      messages_count: messages.length,
      creativity_level: creativityLevel,
      daily_images_used: dailyImageCount,
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tigo-rag-creative-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  RAG Creativo
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Insights estratégicos • {user?.username || 'Usuario'}
                  </p>
                  <div className="flex items-center gap-2 px-2 py-1 bg-purple-100 rounded-full">
                    <ImageIcon className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-700 font-medium">
                      {dailyImageCount}/{DAILY_USER_LIMIT} imágenes hoy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Creativity Level */}
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <Palette className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">
                Creatividad: {creativityLevel}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                className="w-16 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

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

            {/* Config */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Configuración del módulo creativo"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

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
            <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              RAG Creativo - Insights y Visualizaciones
            </h3>
            <p className="text-gray-600 mb-6">
              Genera análisis innovadores, recomendaciones estratégicas y visualizaciones interactivas
            </p>
            
            {/* Creative Prompts */}
            <div className="grid gap-3 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: 'Análisis Predictivo',
                  prompt: 'Genera predicciones sobre el comportamiento del consumidor hondureño en 2025'
                },
                {
                  icon: Lightbulb,
                  title: 'Ideas Innovadoras', 
                  prompt: 'Propón 5 servicios innovadores que Tigo podría lanzar basados en las tendencias actuales'
                },
                {
                  icon: BarChart3,
                  title: 'Visualización de Datos',
                  prompt: 'Crea un dashboard visual comparando el NPS de Tigo vs competencia por región',
                  hasImageOption: true
                },
                {
                  icon: Zap,
                  title: 'Estrategia Disruptiva',
                  prompt: 'Diseña una estrategia para capturar el segmento Gen Z en Honduras',
                  hasImageOption: true
                }
              ].map((prompt, index) => (
                <div key={index} className="bg-white/80 backdrop-blur border border-purple-200 rounded-xl hover:border-purple-300 hover:bg-white/90 transition-all hover:scale-105">
                  <button
                    onClick={() => setInput(prompt.prompt)}
                    className="w-full p-4 text-left"
                  >
                    <prompt.icon className="h-5 w-5 text-purple-600 mb-3" />
                    <h4 className="font-medium text-gray-900 mb-1">{prompt.title}</h4>
                    <p className="text-sm text-gray-600">{prompt.prompt}</p>
                  </button>
                  
                  {/* Image generation button for visual prompts */}
                  {prompt.hasImageOption && (
                    <div className="px-4 pb-3">
                      <button
                        onClick={() => generateImage(prompt.prompt)}
                        disabled={!canGenerateImage() || isGeneratingImage}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors",
                          canGenerateImage() && !isGeneratingImage
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        {isGeneratingImage ? (
                          <>
                            <div className="w-3 h-3 border border-purple-300 border-t-transparent rounded-full animate-spin" />
                            Generando imagen...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3" />
                            {canGenerateImage() ? 'Generar imagen visual' : `Límite diario alcanzado`}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Modo Creativo Activado</span>
              </div>
              <p className="text-xs text-purple-700">
                Genera visualizaciones automáticas, insights innovadores y recomendaciones estratégicas basadas en datos
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4' 
                    : 'bg-white/80 backdrop-blur border border-purple-200 text-gray-900 p-4'
                }`}>
                  {message.role === 'assistant' ? (
                    <div>
                      <MarkdownRenderer content={message.content} />
                      
                      {/* Generated Image */}
                      {(message as any).imageUrl && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <ImageIcon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Imagen Generada con DALL-E</span>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-purple-200 shadow-lg">
                            <img 
                              src={(message as any).imageUrl} 
                              alt={(message as any).imagePrompt || 'Imagen generada'}
                              className="w-full h-auto"
                              loading="lazy"
                            />
                          </div>
                          {(message as any).imagePrompt && (
                            <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                              <p className="text-xs text-purple-700">
                                <strong>Prompt:</strong> {(message as any).imagePrompt}
                              </p>
                            </div>
                          )}
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = (message as any).imageUrl;
                                link.download = `tigo-generated-${Date.now()}.png`;
                                link.click();
                              }}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Visualización */}
                      {message.visualization && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Visualización Generada</span>
                          </div>
                          <div className="text-sm text-blue-700">
                            {message.visualization.title || 'Gráfico interactivo'}
                          </div>
                        </div>
                      )}
                      
                      {message.citations && message.citations.length > 0 && (
                        <CitationsList citations={message.citations} />
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  
                  <div className={`text-xs mt-3 flex items-center justify-between ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && message.metadata && (
                      <div className="flex items-center gap-3">
                        {message.metadata.processing_time_seconds && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {message.metadata.processing_time_seconds}s
                          </span>
                        )}
                        {message.metadata.chunks_retrieved && (
                          <span>📄 {message.metadata.chunks_retrieved}</span>
                        )}
                        {message.visualization && (
                          <span className="text-purple-600">🎨 Visual</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-200 p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm text-purple-700">
                      Creando insights...
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
      <div className="bg-white/90 backdrop-blur border-t border-purple-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tu idea o genera insights creativos..."
              className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
              disabled={isLoading}
              maxLength={5000}
            />
            
            {/* Image Generation Button - only show when there's input and can generate */}
            {input.trim() && messages.length > 0 && (
              <button
                type="button"
                onClick={() => generateImage(input)}
                disabled={!canGenerateImage() || isGeneratingImage}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  canGenerateImage() && !isGeneratingImage
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
                )}
                title={canGenerateImage() ? 'Generar imagen con DALL-E' : `Límite diario alcanzado (${dailyImageCount}/${DAILY_USER_LIMIT})`}
              >
                {isGeneratingImage ? (
                  <>
                    <div className="w-3 h-3 border border-purple-300 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Generando...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-3 w-3" />
                    <span className="hidden sm:inline">Imagen</span>
                  </>
                )}
              </button>
            )}

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2',
                (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Sparkles className="h-4 w-4" />
              Crear
            </button>
          </div>
          
          {/* Creative Stats */}
          <div className="flex justify-between items-center mt-2 text-xs text-purple-600">
            <span className="flex items-center gap-2">
              <Palette className="h-3 w-3" />
              Modo Creativo: Insights innovadores con nivel {creativityLevel}% de creatividad
            </span>
            <span>
              {input.length}/5000
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreativeModule;