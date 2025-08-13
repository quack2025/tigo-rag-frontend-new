// components/Campaign/ArchetypeDeepChat.tsx - Chat profundo con arquetipos

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, X, User, Bot, 
  Download, ChevronLeft, Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SegmentReaction } from '../../types/campaign.types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ArchetypeDeepChatProps {
  isOpen: boolean;
  onClose: () => void;
  archetype: string;
  evaluationContext: SegmentReaction;
  conceptDetails: any;
}

const ArchetypeDeepChat: React.FC<ArchetypeDeepChatProps> = ({
  isOpen,
  onClose,
  archetype,
  evaluationContext,
  conceptDetails
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    // Mensaje inicial del arquetipo
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: generateInitialMessage(),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const generateInitialMessage = () => {
    const persona = evaluationContext.persona_context;
    const score = evaluationContext.overall_score;
    
    let greeting = '';
    
    if (archetype === 'CONTROLADOR') {
      greeting = `Hola, soy ${persona?.name}, ${persona?.occupation} de ${persona?.city}. 

Mire, evalué su propuesta "${conceptDetails.name}" y tengo varias preocupaciones, especialmente con el precio de L${conceptDetails.monthly_price}. Con mi ingreso familiar, eso representa casi el 23% de lo que ganamos mensualmente.

Fíjese que ${evaluationContext.concerns[0]}. También me preocupa que ${evaluationContext.concerns[1]}.

¿Qué me puede decir sobre esto? ¿Hay opciones más económicas para familias como la nuestra?`;
    } else if (archetype === 'PROFESIONAL') {
      greeting = `Buenos días, soy ${persona?.name}, ${persona?.occupation} en ${persona?.city}.

He revisado su concepto "${conceptDetails.name}" desde una perspectiva empresarial. Mi evaluación general es ${score}/100.

${evaluationContext.key_insights[0]}. Sin embargo, necesito entender mejor algunos aspectos técnicos y el ROI esperado.

¿Podemos discutir las métricas de rendimiento específicas y casos de éxito empresariales?`;
    } else if (archetype === 'EMPRENDEDOR') {
      greeting = `¡Hola! Soy ${persona?.name}, ${persona?.occupation} en ${persona?.city}.

Como emprendedor, siempre busco herramientas que me ayuden a crecer mi negocio. Su propuesta "${conceptDetails.name}" me parece interesante, pero necesito entender mejor cómo me ayudará a generar más ventas.

${evaluationContext.key_insights[0]}. Mi pregunta principal es: ¿cómo esto se traduce en más clientes y mejores ingresos para mi negocio?`;
    } else if (archetype === 'GOMOSO_EXPLORADOR') {
      greeting = `¡Hey! Soy ${persona?.name}, ${persona?.occupation} en ${persona?.city}. 

¡Me encanta explorar nuevas tecnologías! Tu concepto "${conceptDetails.name}" suena ${score > 70 ? 'súper cool' : 'interesante pero podría ser más innovador'}.

Lo que más me llama la atención es ${evaluationContext.variable_reactions.name.reaction_text.substring(0, 100)}...

¿Qué lo hace realmente único comparado con lo que ya existe? ¿Hay features exclusivos que pueda presumir en mis redes?`;
    } else if (archetype === 'PRAGMATICO') {
      greeting = `Buenas, soy ${persona?.name}, ${persona?.occupation} de ${persona?.city}.

Yo busco cosas simples y que funcionen. Su producto "${conceptDetails.name}" me parece ${score > 60 ? 'aceptable' : 'complicado para lo que necesito'}.

${evaluationContext.variable_reactions.benefits.reaction_text}

¿Tienen una versión más básica y económica? Solo necesito lo esencial.`;
    } else if (archetype === 'RESIGNADO') {
      greeting = `Buenas tardes, soy ${persona?.name}, ${persona?.occupation} de ${persona?.city}.

A mi edad, uno ya no entiende mucho de tecnología. Este "${conceptDetails.name}" suena muy complicado. ${evaluationContext.variable_reactions.description.reaction_text}

¿Me pueden explicar en palabras sencillas qué beneficios reales tendría? ¿Y quién me ayudaría a usarlo?`;
    } else {
      greeting = `Hola, soy ${persona?.name} de ${persona?.city}. He evaluado su concepto y tengo algunas preguntas...`;
    }

    return greeting;
  };

  const generateContextualResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Contexto disponible para respuestas
    // archetype, evaluationContext, conceptDetails están disponibles en el scope

    // Respuestas contextuales basadas en el arquetipo y la pregunta
    if (archetype === 'CONTROLADOR') {
      if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('pago')) {
        return `Mire, como le mencioné, L${conceptDetails.monthly_price} es demasiado para nosotros. Actualmente pago L${500} por mi plan actual, y esto sería un aumento del 469%.

${evaluationContext.variable_reactions.price.reaction_text}

¿No tienen planes familiares con descuento? ¿O alguna opción de financiamiento sin intereses? Necesito algo que no supere los L800-1000 mensuales para que sea viable para mi presupuesto familiar.

También me preocupa: ¿hay costos ocultos? ¿El precio subirá después de unos meses? Estas son las cosas que siempre nos afectan a las familias.`;
      }
      
      if (lowerMessage.includes('beneficio') || lowerMessage.includes('ventaja')) {
        return `Los beneficios que mencionan... ${evaluationContext.variable_reactions.benefits.reaction_text}

Para mi familia, lo más importante sería:
1. Que todos podamos usarlo sin restricciones
2. Control parental para los niños
3. Que no haya sorpresas en la factura
4. Poder cancelar cuando queramos sin penalidades

¿Pueden garantizar estos puntos? Porque he tenido malas experiencias antes donde prometen mucho y después no cumplen.`;
      }

      if (lowerMessage.includes('garantía') || lowerMessage.includes('contrato')) {
        return `Exactamente ese es mi punto. Necesito garantías claras. 

¿Qué pasa si no estoy satisfecha? ¿Puedo cancelar sin costo? ¿Hay periodo de prueba? 

También necesito saber: ¿el contrato es por tiempo definido? ¿Puedo cambiar de plan si mis necesidades cambian? 

La transparencia es fundamental para mí. No quiero letra chiquita ni sorpresas.`;
      }
    } else if (archetype === 'PROFESIONAL') {
      if (lowerMessage.includes('roi') || lowerMessage.includes('productividad') || lowerMessage.includes('eficiencia')) {
        return `Desde mi perspectiva profesional, el ROI es crítico. Con una inversión de L${conceptDetails.monthly_price} mensuales, necesito ver beneficios tangibles.

Específicamente:
- ¿Cuánto tiempo ahorraría en procesos diarios?
- ¿Mejora la colaboración remota con mi equipo?
- ¿Hay métricas de otros clientes corporativos similares?
- ¿Incluye soporte técnico prioritario 24/7?

${evaluationContext.variable_reactions.benefits.specific_feedback}

¿Pueden proporcionar un caso de negocio específico con números reales?`;
      }

      if (lowerMessage.includes('implementación') || lowerMessage.includes('integración')) {
        return `La implementación es crucial para nosotros. ${evaluationContext.concerns.find(c => c.includes('implementación')) || 'Necesitamos un proceso sin interrupciones'}.

Mis preguntas específicas:
- ¿Cuánto tiempo toma la implementación completa?
- ¿Es compatible con nuestros sistemas actuales?
- ¿Ofrecen capacitación para el equipo?
- ¿Hay soporte durante la migración?

No podemos permitirnos interrupciones en nuestra operación diaria.`;
      }
    } else if (archetype === 'EMPRENDEDOR') {
      if (lowerMessage.includes('venta') || lowerMessage.includes('cliente') || lowerMessage.includes('negocio')) {
        return `¡Ese es el punto clave! Mi negocio necesita herramientas que generen resultados directos.

${evaluationContext.variable_reactions.benefits.reaction_text}

Lo que realmente necesito saber:
- ¿Incluye WhatsApp Business ilimitado?
- ¿Puedo gestionar múltiples líneas para mi equipo?
- ¿Hay herramientas de marketing incluidas?
- ¿Funciona bien para pagos móviles y transferencias?

Si esto me ayuda a aumentar ventas aunque sea un 20%, valdría la pena la inversión. ¿Tienen testimonios de otros emprendedores hondureños?`;
      }
    } else if (archetype === 'GOMOSO_EXPLORADOR') {
      if (lowerMessage.includes('único') || lowerMessage.includes('exclusivo') || lowerMessage.includes('innovador')) {
        return `¡Eso es lo que busco! Necesito algo que realmente destaque. 

${evaluationContext.variable_reactions.differentiation.reaction_text}

Específicamente quiero saber:
- ¿Hay features que NADIE más tiene en Honduras?
- ¿Puedo ser beta tester o early adopter con beneficios especiales?
- ¿Hay contenido exclusivo para compartir en Instagram/TikTok?
- ¿Viene con algún tipo de gamificación o rewards?

Si no es único y cool, no me interesa. Ya tengo suficientes servicios básicos.`;
      }
    }

    // Respuesta genérica contextual
    return `Entiendo su pregunta sobre "${userMessage}". 

Basándome en mi evaluación inicial donde otorgué ${evaluationContext.overall_score}/100 al concepto, ${evaluationContext.key_insights[0]}

${evaluationContext.suggestions[0]}

¿Hay algo específico sobre esto que le gustaría discutir?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular respuesta del arquetipo
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateContextualResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const exportChat = () => {
    const chatData = {
      archetype,
      persona: evaluationContext.persona_context,
      concept: conceptDetails,
      evaluation_summary: {
        score: evaluationContext.overall_score,
        sentiment: evaluationContext.overall_sentiment,
        key_insights: evaluationContext.key_insights,
        concerns: evaluationContext.concerns,
        suggestions: evaluationContext.suggestions
      },
      conversation: messages,
      exported_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `chat-${archetype}-${Date.now()}.json`);
    linkElement.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <MessageSquare className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">
                Chat Profundo: {archetype}
              </h2>
              <p className="text-xs opacity-90">
                {evaluationContext.persona_context?.name} • {evaluationContext.persona_context?.occupation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Exportar chat"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Context Bar */}
        <div className="bg-purple-50 p-3 border-b border-purple-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-purple-800">Contexto:</span>
              <span className="text-purple-700 ml-2">
                Evaluación de "{conceptDetails.name}" • Score: {evaluationContext.overall_score}/100 • 
                Sentiment: {evaluationContext.overall_sentiment} • 
                Principal preocupación: {evaluationContext.concerns[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                message.role === 'assistant' 
                  ? "bg-purple-600 text-white" 
                  : "bg-blue-600 text-white"
              )}>
                {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "flex-1 max-w-[75%]",
                message.role === 'user' && "flex justify-end"
              )}>
                <div className={cn(
                  "rounded-lg p-4",
                  message.role === 'assistant' 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-blue-600 text-white"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-2",
                    message.role === 'assistant' ? "text-gray-500" : "text-blue-200"
                  )}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto">
            {[
              "¿Qué opciones de precio tienen?",
              "¿Cómo se compara con la competencia?",
              "¿Hay periodo de prueba?",
              "¿Qué garantías ofrecen?"
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(question)}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Haz una pregunta específica sobre la evaluación..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                inputMessage.trim() && !isLoading
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeDeepChat;