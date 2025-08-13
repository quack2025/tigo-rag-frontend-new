// components/Campaign/HumanArchetypeChat.tsx - Chat ultra-humano con role prompting

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, User, 
  Download, ChevronLeft, Mic, Phone
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SegmentReaction } from '../../types/campaign.types';
import { LANGUAGE_PATTERNS } from '../../data/hondurasKnowledgeBase';
import { llmChatService } from '../../services/llmChatService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

interface HumanArchetypeChatProps {
  isOpen: boolean;
  onClose: () => void;
  archetype: string;
  evaluationContext: SegmentReaction;
  conceptDetails: any;
}

const HumanArchetypeChat: React.FC<HumanArchetypeChatProps> = ({
  isOpen,
  onClose,
  archetype,
  evaluationContext,
  conceptDetails
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>({
    mood: 'neutral',
    trust_level: 0,
    questions_asked: 0,
    topics_discussed: []
  });
  const [creativity, setCreativity] = useState(75); // 0-100
  const [useLLM, setUseLLM] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      checkBackendHealth();
      initializeChat();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const checkBackendHealth = async () => {
    const isHealthy = await llmChatService.checkBackendHealth();
    setBackendAvailable(isHealthy);
    if (!isHealthy) {
      console.warn('Backend no disponible, usando respuestas hardcoded');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    // Mensaje inicial ultra-humano
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: generateHumanInitialMessage(),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const generateHumanInitialMessage = () => {
    const persona = evaluationContext.persona_context;
    const languagePatterns = LANGUAGE_PATTERNS[archetype as keyof typeof LANGUAGE_PATTERNS];
    
    // Obtener expresión casual inicial
    const casualGreeting = languagePatterns?.informal_expressions?.[
      Math.floor(Math.random() * languagePatterns.informal_expressions.length)
    ] || 'Hola';
    
    let greeting = '';
    
    if (archetype === 'CONTROLADOR') {
      greeting = `${casualGreeting} Buenas tardes... disculpe, ¿usted es de Tigo verdad? 

Mire, yo soy ama de casa aquí en ${persona?.city}, y pues... la verdad es que vi eso del plan nuevo que están sacando... el de los L${conceptDetails.monthly_price}... 

*suspira* 

Fíjese que... no sé, me parece bastante caro para nosotros. Ahorita pagamos como L500 y ya a veces nos cuesta... 

¿Ustedes no tienen algo más... más accesible? Es que con lo que gana mi esposo y lo poquito que yo hago vendiendo cositas, pues... cada lempira cuenta, ¿verdad?`;
      
    } else if (archetype === 'PROFESIONAL') {
      greeting = `Ah, hola, qué tal. Disculpe la demora, estaba en una llamada...

*se acomoda en la silla*

Miren, les voy a ser honesto. Vi su propuesta del 5G Pro y... mmm... tengo sentimientos encontrados. 

Por un lado, en mi trabajo necesitamos velocidad, eso es innegable. Las videollamadas con clientes en Miami a veces se cortan y es... frustrante.

Pero L${conceptDetails.monthly_price}? Eso es bastante. Y no es solo el precio, es que... ¿realmente va a funcionar como prometen? Porque ya me han vendido "lo mejor" antes y...

*hace gesto con la mano*

Ya sabe cómo es esto en Honduras, ¿no?`;
      
    } else if (archetype === 'EMPRENDEDOR') {
      greeting = `¡Ey! ¡Qué onda! Disculpe, es que ando full con el negocio...

*ruido de WhatsApp sonando*

Perdón, perdón... es que los clientes no paran de escribir jaja. 

Mire, vi eso del plan nuevo de ustedes. Me llama la atención porque... puchica, necesito mejor internet para el negocio, eso sí. 

Pero brother, L${conceptDetails.monthly_price}? Uff... 

*se ríe nervioso*

O sea, si me va a ayudar a vender más, podría considerarlo... pero necesito números reales, ¿me entiende? No promesas vacías. 

¿Esto me va a servir para WhatsApp Business? ¿Para subir videos de los productos? Es que si no...`;
      
    } else if (archetype === 'GOMOSO_EXPLORADOR') {
      greeting = `Heyyyy! ¿Qué tal? 

*se acomoda los audífonos*

Okay, okay, vi su cosa del 5G Pro en Instagram... o fue en TikTok? No me acuerdo jaja

Anyway... se ve cool pero... no sé, ¿es realmente tan diferente? Porque todos dicen tener "lo mejor" y al final...

*revisa el teléfono*

Perdón, es que me llegó una notificación... 

A ver, siendo real contigo... ¿qué tiene de especial? ¿Hay algo que pueda presumir con mis amigos? Porque si es solo "más velocidad"... meh 🤷‍♀️`;
      
    } else if (archetype === 'PRAGMATICO') {
      greeting = `Buenas...

*se sienta*

Mire, voy a ser directo. No tengo mucho tiempo, tengo que regresar al trabajo en media hora.

Vi lo del plan ese nuevo... el 5G como se llame. La cosa es... ¿para qué necesito yo eso? 

Yo solo uso WhatsApp, veo las noticias, a veces YouTube cuando tengo tiempo... 

L${conceptDetails.monthly_price} me parece... excesivo. Con L${conceptDetails.monthly_price} hago mercado para dos semanas.

¿No tienen algo más... normal? Sin tanta cosa rara que no voy a usar?`;
      
    } else if (archetype === 'RESIGNADO') {
      greeting = `Ay, buenas tardes...

*se acomoda los lentes*

Disculpe, es que no veo bien... ¿usted es de la Tigo?

Mi hijo me dijo que viniera a preguntar sobre un plan nuevo... pero la verdad, yo no entiendo mucho de estas cosas de la tecnología...

*suspira*

Él dice que es mejor, pero... ay, no sé. Todo me parece tan complicado ahora. Antes uno solo tenía su teléfono de casa y ya, ¿verdad?

¿Me puede explicar... pero así, sencillito? Es que cuando empiezan con palabras técnicas me pierdo...`;
      
    } else {
      greeting = `Hola... eh... ¿podemos hablar sobre el plan?`;
    }

    return greeting;
  };

  const generateDynamicResponse = async (userMessage: string): Promise<string> => {
    if (useLLM && backendAvailable) {
      try {
        const response = await llmChatService.generateDynamicResponse({
          userMessage,
          archetype,
          evaluationContext,
          conceptDetails,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          })),
          creativity
        });

        if (response.success) {
          return response.response;
        } else {
          console.warn('LLM falló, usando fallback:', response.error);
          return generateHardcodedResponse(userMessage);
        }
      } catch (error) {
        console.error('Error en respuesta dinámica:', error);
        return generateHardcodedResponse(userMessage);
      }
    } else {
      return generateHardcodedResponse(userMessage);
    }
  };

  const generateHardcodedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const languagePatterns = LANGUAGE_PATTERNS[archetype as keyof typeof LANGUAGE_PATTERNS];
    
    // Incrementar contexto de conversación
    setConversationContext((prev: any) => ({
      ...prev,
      questions_asked: prev.questions_asked + 1,
      trust_level: Math.min(prev.trust_level + 0.1, 1)
    }));

    // Obtener expresiones casuales
    const getRandomExpression = (type: keyof typeof languagePatterns) => {
      const expressions = languagePatterns?.[type] || [];
      return expressions[Math.floor(Math.random() * expressions.length)] || '';
    };

    // RESPUESTAS ULTRA-HUMANAS POR ARQUETIPO
    if (archetype === 'CONTROLADOR') {
      if (lowerMessage.includes('descuento') || lowerMessage.includes('50%')) {
        return `¿50% de descuento? 

*se inclina hacia adelante interesada*

Ay, eso sí suena mejor... pero espérese, espérese... 

*saca el teléfono para calcular*

A ver... serían como... ¿L${Math.round(conceptDetails.monthly_price * 0.5)}? Mmm...

Pero díganme la verdad, ¿eso es solo por los primeros meses verdad? Porque luego suben el precio y uno ya está amarrado al contrato...

*mira con desconfianza*

Y otra cosa... usted dice "solo redes sociales"... pero mis hijos usan YouTube para las tareas, mi esposo ve las noticias... ¿eso entra o no entra?

Es que mire, una vecina se cambió a un plan "barato" y después le salió más caro que el anterior con todos los extras que le cobraban...

¿No hay letra chiquita? ¿Seguro?`;
      }
      
      if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
        return `Ay, el precio... 

*suspira profundamente*

Mire, le voy a ser honesta. Mi esposo gana L${12500}, yo hago unos L3000 vendiendo comida los fines de semana...

*cuenta con los dedos*

Entre la renta, la comida, el colegio de los niños, la luz que viene carísima... al final del mes quedamos en ceros. A veces hasta pedimos prestado...

L${conceptDetails.monthly_price} es... puchica, es lo que gasto en comida en una semana. 

*se frota la frente*

¿No hay forma de... no sé, pagarlo en cuotas? ¿O un plan familiar donde todos usemos pero paguemos menos?

Es que yo sí quisiera mejor internet, los niños se quejan para hacer las tareas... pero es que no nos alcanza...`;
      }

      if (lowerMessage.includes('beneficio') || lowerMessage.includes('ventaja')) {
        return `Los beneficios...

*se acomoda en la silla*

Mire, a mí lo que me importa es que funcione cuando lo necesitamos. Que los niños puedan hacer sus tareas sin que se esté cayendo el internet...

Que cuando hablo con mi mamá en Copán por videollamada no se congele a cada rato...

*cuenta con los dedos*

Y que no me cobren extra por todo. Porque luego uno usa tantito más y zas! La factura viene del doble...

¿Este plan tiene control parental? Es que el pequeño se mete en cada cosa en YouTube... 

Y otra cosa, ¿puedo ver cuánto gasta cada quien? Porque mi hija la grande se la pasa en TikTok y gasta todos los datos...

Eso es lo que necesito. No necesito "5G ultra rápido"... necesito que funcione y que pueda controlarlo.`;
      }

    } else if (archetype === 'PROFESIONAL') {
      if (lowerMessage.includes('roi') || lowerMessage.includes('productividad')) {
        return `ROI... sí, ese es el punto clave.

*saca su laptop*

Mire, déjeme mostrarle algo. Nosotros perdemos aproximadamente 2 horas semanales por problemas de conectividad. Videollamadas que se caen, archivos que no se suben...

*teclea rápido*

Si su servicio realmente puede eliminar eso... serían 8 horas al mes, a un costo promedio de L500 la hora en productividad... estamos hablando de L4000 en pérdidas.

Entonces sí, L${conceptDetails.monthly_price} se justificaría... PERO...

*cierra la laptop*

Y este es un gran pero... ¿tienen SLA? ¿Garantizan uptime del 99.9%? ¿Qué pasa si falla en medio de una presentación importante?

Porque mire, yo he tenido Tigo antes, y cuando uno llama al soporte... "reinicie el módem"... brother, necesito soluciones reales, no un script.

¿Tienen soporte dedicado para empresas? ¿Con gente que realmente sepa?`;
      }

      if (lowerMessage.includes('implementación') || lowerMessage.includes('migración')) {
        return `Ah, la implementación...

*se recuesta en la silla*

Ese es siempre el dolor de cabeza. La última vez que cambiamos de proveedor, estuvimos 3 días sin internet. Tres días. ¿Sabe lo que eso significa para una empresa?

*hace gestos con las manos*

Los clientes llamando, los correos acumulándose, el equipo sin poder trabajar...

Entonces necesito saber: ¿Cuánto tiempo real toma? Y no me diga "un día" porque nunca es un día...

¿Vienen a la oficina? ¿Configuran todo? ¿Hacen pruebas?

¿Qué pasa con nuestros números actuales? ¿Se pueden portar?

*revisa su teléfono*

Y otra cosa... ¿es compatible con nuestro sistema VoIP? Usamos Microsoft Teams para todo...

Si me garantizan una transición sin interrupciones, podríamos considerarlo seriamente.`;
      }

    } else if (archetype === 'EMPRENDEDOR') {
      if (lowerMessage.includes('negocio') || lowerMessage.includes('venta')) {
        return `¡Ah! ¡Del negocio sí hablamos!

*se anima visiblemente*

Mire mire, le cuento rapidito. Tengo mi tienda online, vendo accesorios, ropa... 

*muestra el teléfono*

Todo lo manejo por aquí. Instagram, WhatsApp Business, Facebook... Los clientes me escriben a toda hora.

El problema es que a veces estoy subiendo fotos de productos nuevos y tarda HORAS. ¡Horas! Y los clientes se desesperan...

*se frustra*

La semana pasada perdí una venta de L3000 porque la clienta se aburrió de esperar que le mandara el catálogo...

Entonces sí, si su 5G este me ayuda a subir todo más rápido, a hacer lives sin que se corte...

*calcula mentalmente*

Podría vender unos... 30% más? 40% tal vez?

Pero necesito que me aseguren que WhatsApp no se va a trabar. Que puedo mandar videos pesados. Que los lives no se van a pixelear...

¿Me entiende? No es solo "internet rápido"... es MI NEGOCIO.`;
      }

    } else if (archetype === 'GOMOSO_EXPLORADOR') {
      if (lowerMessage.includes('exclusiv') || lowerMessage.includes('único') || lowerMessage.includes('diferente')) {
        return `Okay okay, a ver...

*se acomoda excitado*

¿Exclusivo? Me gusta cómo suena eso... 

Pero es que todos dicen ser "exclusivos" y al final... nah, es lo mismo de siempre con diferente empaque.

*scrollea en su teléfono*

Mira, te voy a ser real. Yo soy de los que siempre tiene lo último. El iPhone nuevo, los AirPods Pro, la laptop gamer...

*muestra sus gadgets*

Pero no es por presumir... bueno, un poquito sí jaja... es que me gusta estar ahead of the curve, ¿me entiendes?

Entonces dime... ¿qué tiene este 5G que no tenga Claro? ¿Hay algún feature que solo ustedes tienen?

¿Puedo stremear en 4K sin lag? ¿Puedo subir stories súper HD? 

¿Hay algún tipo de... no sé, acceso beta a cosas nuevas? ¿Early access?

Porque si es solo "más velocidad"... bro, todos dicen eso.

*se cruza de brazos*

Convénceme. ¿Qué puedo hacer con esto que mis amigos van a decir "woah, ¿cómo hiciste eso?"`;
      }

    } else if (archetype === 'PRAGMATICO') {
      if (lowerMessage.includes('básico') || lowerMessage.includes('simple') || lowerMessage.includes('esencial')) {
        return `Exacto, eso es lo que busco. Algo simple.

*asiente con la cabeza*

Mire, yo no soy de complicarme. Trabajo, casa, familia. No tengo tiempo para estar aprendiendo cosas nuevas.

Mi teléfono lo uso para:
- WhatsApp, para hablar con la familia
- Ver las noticias
- A veces YouTube cuando almuerzo
- Las llamadas normales

Ya. Eso es todo.

*se rasca la cabeza*

No necesito "5G ultra rápido" para eso, ¿verdad?

¿No tienen un plan... no sé, "Tigo Básico" o algo así? Sin tanta película...

Que funcione, que no sea caro, y que no tenga sorpresas en la factura. 

L${conceptDetails.monthly_price} es demasiado para lo que yo uso. Con L800, L1000 máximo... ahí sí hablamos.

¿Existe esa opción o no?`;
      }

    } else if (archetype === 'RESIGNADO') {
      if (lowerMessage.includes('explicar') || lowerMessage.includes('sencillo') || lowerMessage.includes('fácil')) {
        return `Ay, sí por favor, explíqueme despacito...

*se acerca para escuchar mejor*

Es que mi hijo me dice "mamá, es fácil" pero para mí nada de esto es fácil...

*suspira*

Antes uno solo marcaba el número y ya. Ahora hay que hacer no sé cuántas cosas...

¿El 5G ese es como el 4G pero más rápido? ¿Y para qué necesito más rápido si apenas sé usar WhatsApp?

*se ríe nerviosamente*

Mi nieta me enseñó a mandar los stickers esos... me tardé como un mes en aprender jaja...

Pero dígame... ¿es muy complicado de usar? ¿Hay que configurar muchas cosas?

¿Y si algo sale mal, quién me ayuda? Porque mi hijo trabaja todo el día...

*se ve preocupada*

No quiero quedarme sin poder hablar con mi familia. Eso es lo único que me importa.`;
      }
    }

    // Respuesta genérica ultra-humana
    return `Mmm... 

*piensa un momento*

${getRandomExpression('informal_expressions')}

No sé si entendí bien su pregunta... ¿me puede explicar un poquito más?

*se rasca la cabeza*

Es que a veces me pierdo con tantos términos...`;
  };

  const simulateTyping = async (duration: number = 2000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular que está escribiendo
    await simulateTyping(1500 + Math.random() * 2000);

    // Generar respuesta (dinámica o hardcoded)
    const responseContent = await generateDynamicResponse(currentInput);

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    // Actualizar contexto de conversación
    setConversationContext((prev: any) => ({
      ...prev,
      questions_asked: prev.questions_asked + 1,
      trust_level: Math.min(prev.trust_level + 0.1, 1)
    }));
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
      conversation_context: conversationContext,
      exported_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `entrevista-${archetype}-${Date.now()}.json`);
    linkElement.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header más humano */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Entrevista con {evaluationContext.persona_context?.name}
              </h2>
              <p className="text-xs opacity-90 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  En llamada
                </span>
                • {evaluationContext.persona_context?.occupation} • {evaluationContext.persona_context?.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Exportar entrevista"
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

        {/* Indicador de contexto más sutil */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-600">
              <span>📍 {evaluationContext.persona_context?.city}</span>
              <span>💼 {archetype}</span>
              <span>📊 Score: {evaluationContext.overall_score}/100</span>
            </div>
            <div className="flex items-center gap-2">
              {conversationContext.trust_level > 0.5 && (
                <span className="text-green-600">Confianza alta</span>
              )}
              <span className="text-gray-500">
                {conversationContext.questions_asked} preguntas
              </span>
            </div>
          </div>
        </div>

        {/* Configuración de Chat */}
        <div className="bg-white px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Modo:</span>
                <button
                  onClick={() => setUseLLM(!useLLM)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium transition-colors",
                    useLLM && backendAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  )}
                  title={!backendAvailable ? "Backend no disponible" : ""}
                >
                  {useLLM && backendAvailable ? "🤖 Dinámico" : "📝 Estático"}
                </button>
              </div>
              
              {useLLM && backendAvailable && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Creatividad:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${creativity}%, #e5e7eb ${creativity}%, #e5e7eb 100%)`
                    }}
                  />
                  <span className="text-xs text-indigo-600 font-medium w-8">
                    {creativity}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {!backendAvailable && (
                <span className="text-amber-600 flex items-center gap-1">
                  ⚠️ Sin conexión al LLM
                </span>
              )}
              <span className="text-gray-500">
                Temp: {(creativity / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "flex-shrink-0",
                message.role === 'assistant' && "mt-1"
              )}>
                {message.role === 'assistant' ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Tú</span>
                  </div>
                )}
              </div>
              
              <div className={cn(
                "flex-1 max-w-[75%]",
                message.role === 'user' && "flex justify-end"
              )}>
                <div className={cn(
                  "rounded-2xl px-4 py-3",
                  message.role === 'assistant' 
                    ? "bg-white shadow-sm" 
                    : "bg-indigo-600 text-white"
                )}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className={cn(
                    "text-xs mt-2",
                    message.role === 'assistant' ? "text-gray-400" : "text-indigo-200"
                  )}>
                    {message.timestamp.toLocaleTimeString('es-HN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <User className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm italic">
                    {evaluationContext.persona_context?.name} está escribiendo
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Preguntas sugeridas más naturales */}
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              "¿Qué precio estaría dispuesto a pagar?",
              "¿Qué es lo más importante para usted?",
              "¿Ha tenido problemas con su servicio actual?",
              "¿Qué opina su familia de esto?"
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(question)}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input más conversacional */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Grabar audio (próximamente)"
            >
              <Mic className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={cn(
                "p-2 rounded-full transition-colors",
                inputMessage.trim() && !isLoading
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanArchetypeChat;