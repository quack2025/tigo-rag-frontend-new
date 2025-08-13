// components/Personas/FocusGroupSimulator.tsx - Simulador de Focus Groups

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Users, Play, Pause, Download, MessageCircle, User, Mic } from 'lucide-react';
import { cn } from '../../lib/utils';
import { llmChatService } from '../../services/llmChatService';

interface FocusGroupParticipant {
  id: string;
  name: string;
  age: number;
  location: string;
  segment: string;
  personality: string;
  is_speaking: boolean;
  opinion_style: 'leader' | 'follower' | 'contrarian' | 'neutral';
}

interface FocusGroupMessage {
  participant_id: string;
  participant_name: string;
  message: string;
  timestamp: Date;
  reaction_to?: string;
}

interface FocusGroupSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  personas?: any[];
}

const FocusGroupSimulator: React.FC<FocusGroupSimulatorProps> = ({ isOpen, onClose, personas = [] }) => {
  const [participants, setParticipants] = useState<FocusGroupParticipant[]>([]);
  const [messages, setMessages] = useState<FocusGroupMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [moderatorQuestion, setModeratorQuestion] = useState('');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [manualQuestion, setManualQuestion] = useState('');
  const [isWaitingForResponses, setIsWaitingForResponses] = useState(false);
  const [sessionConfig] = useState({
    duration_minutes: 30,
    participant_count: 6,
    interaction_style: 'dynamic', // dynamic, structured, free-form
    language: 'spanish'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);

  // Obtener el concepto evaluado y temas con useMemo para evitar re-renders
  const evaluatedConcept = useMemo(() => personas?.[0]?.concept, [personas]);
  
  const predefinedTopics = useMemo(() => {
    if (evaluatedConcept) {
      return [
        `Reacción inicial al concepto: "${evaluatedConcept.name}"`,
        `Opinión sobre el nombre "${evaluatedConcept.name}"`,
        `Percepción de los beneficios propuestos`,
        `Evaluación del precio (L ${evaluatedConcept.monthly_price?.toLocaleString() || 'Por definir'})`,
        `Diferenciación vs competencia`,
        `Adecuación del público objetivo`,
        `Efectividad del canal de distribución`,
        `Percepción del tono de comunicación`,
        `Atractivo del call-to-action`,
        `Probabilidad de adopción y recomendación`
      ];
    }
    return [
      "Experiencia con el servicio 5G de Tigo",
      "Percepción de los planes y precios",
      "Comparación con la competencia (Claro, Hondutel)",
      "Servicio al cliente y puntos de venta",
      "Cobertura en zonas rurales vs urbanas",
      "Uso de aplicaciones móviles y servicios digitales",
      "Expectativas sobre nuevos servicios",
      "Impacto de las promociones y ofertas"
    ];
  }, [evaluatedConcept]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeParticipants = useCallback(() => {
    console.log('🔧 initializeParticipants called with personas:', personas?.length);
    // Crear participantes basados en personas existentes o generar nuevos
    const focusGroupParticipants: FocusGroupParticipant[] = [];
    
    // Si hay personas disponibles, usar las primeras 6
    if (personas && personas.length > 0) {
      const selectedPersonas = personas.slice(0, sessionConfig.participant_count);
      selectedPersonas.forEach(persona => {
        focusGroupParticipants.push({
          id: persona.id,
          name: persona.name,
          age: persona.age,
          location: persona.location,
          segment: persona.segment,
          personality: persona.personality_traits?.[0] || 'Neutral',
          is_speaking: false,
          opinion_style: ['leader', 'follower', 'contrarian', 'neutral'][Math.floor(Math.random() * 4)] as any
        });
      });
    } else {
      // Generar participantes de ejemplo
      for (let i = 0; i < sessionConfig.participant_count; i++) {
        focusGroupParticipants.push({
          id: `participant-${i}`,
          name: generateName(),
          age: 25 + Math.floor(Math.random() * 30),
          location: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba'][Math.floor(Math.random() * 3)],
          segment: ['Millennials', 'Gen Z', 'Profesionales'][Math.floor(Math.random() * 3)],
          personality: ['Analítico', 'Social', 'Práctico'][Math.floor(Math.random() * 3)],
          is_speaking: false,
          opinion_style: ['leader', 'follower', 'contrarian', 'neutral'][Math.floor(Math.random() * 4)] as any
        });
      }
    }
    
    console.log('👥 Created participants:', focusGroupParticipants.length, focusGroupParticipants.map(p => p.name));
    setParticipants(focusGroupParticipants);
  }, [personas, sessionConfig.participant_count]);

  useEffect(() => {
    if (isOpen) {
      initializeParticipants();
    }
  }, [isOpen, initializeParticipants]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sincronizar el ref cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  }, [isOpen]);

  const generateName = () => {
    const nombres = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen'];
    const apellidos = ['López', 'García', 'Rodríguez', 'Martínez'];
    return `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
  };

  const startFocusGroup = async () => {
    console.log('🚀 startFocusGroup called', { currentTopic, participantCount: participants.length });
    
    if (!currentTopic) {
      alert('Por favor selecciona o ingresa un tema para discutir');
      return;
    }

    console.log('✅ Starting focus group with topic:', currentTopic);
    setIsRunning(true);
    isRunningRef.current = true;
    setMessages([]);
    setCurrentRound(0);
    setIsWaitingForResponses(false);

    // Mensaje inicial del moderador específico al concepto
    const introMessage = evaluatedConcept 
      ? `Buenos días y gracias por participar en este focus group. Hoy vamos a discutir sobre el concepto "${evaluatedConcept.name}" que ya tuvieron la oportunidad de evaluar individualmente. La idea es profundizar en sus opiniones y ver cómo interactúan sus perspectivas.`
      : `Buenos días a todos. Gracias por participar en este focus group sobre ${currentTopic}. Vamos a comenzar con una pregunta general.`;
    
    console.log('📝 Adding moderator intro message:', introMessage);
    addModeratorMessage(introMessage);

    // Simular primera pregunta específica
    setTimeout(() => {
      console.log('⏰ First question timeout executed');
      let firstQuestion = moderatorQuestion;
      
      if (!firstQuestion && evaluatedConcept) {
        const questionTemplates = [
          `¿Cuál fue su primera impresión cuando escucharon sobre "${evaluatedConcept.name}"?`,
          `Basándose en sus evaluaciones individuales, ¿qué aspectos les parecieron más atractivos del concepto?`,
          `¿Cómo creen que sus amigos y familiares reaccionarían ante "${evaluatedConcept.name}"?`,
          `Si tuvieran que explicar "${evaluatedConcept.name}" a alguien más, ¿qué dirían?`
        ];
        firstQuestion = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
      } else if (!firstQuestion) {
        firstQuestion = `¿Cuál es su experiencia general con ${currentTopic}?`;
      }
      
      console.log('❓ Adding first question:', firstQuestion);
      addModeratorMessage(firstQuestion);
      
      console.log('🎭 About to call simulateResponses with', { participantCount: participants.length, isRunning, isRunningRef: isRunningRef.current });
      setIsWaitingForResponses(true);
      simulateResponses(firstQuestion);
    }, 2000);
  };

  const addModeratorMessage = (message: string) => {
    setMessages(prev => [...prev, {
      participant_id: 'moderator',
      participant_name: 'Moderador',
      message,
      timestamp: new Date()
    }]);
  };

  const simulateResponses = async (question: string) => {
    console.log('🎯 simulateResponses called', { question, isRunning, isRunningRef: isRunningRef.current, participantCount: participants.length });
    
    if (!isRunningRef.current) {
      console.log('❌ Not running (ref check), exiting simulateResponses');
      return;
    }

    // Simular respuestas de participantes
    const responseOrder = [...participants].sort(() => Math.random() - 0.5);
    console.log('👥 Response order:', responseOrder.map(p => p.name));
    
    for (let i = 0; i < responseOrder.length; i++) {
      if (!isRunningRef.current) {
        console.log('❌ Loop broken at participant', i);
        break;
      }
      
      const participant = responseOrder[i];
      const delay = 3000 + Math.random() * 2000; // 3-5 segundos entre respuestas
      console.log(`⏰ Scheduling ${participant.name} response in ${delay.toFixed(0)}ms`);
      
      setTimeout(async () => {
        console.log(`🎬 Timeout executed for ${participant.name}, isRunning: ${isRunning}, isRunningRef: ${isRunningRef.current}`);
        if (!isRunningRef.current) {
          console.log(`❌ ${participant.name} skipped - not running`);
          return;
        }
        
        // Generar respuesta basada en el estilo de opinión
        let participantResponse = '';
        try {
          const response = await generateParticipantResponse(participant, question);
          participantResponse = response; // Guardar para usar en reacciones
          console.log(`💬 ${participant.name} says:`, response.substring(0, 50) + '...');
          
          setMessages(prev => [...prev, {
            participant_id: participant.id,
            participant_name: participant.name,
            message: response,
            timestamp: new Date()
          }]);
          
          console.log(`✅ Message added for ${participant.name}`);
        } catch (error) {
          console.error(`❌ Error generating response for ${participant.name}:`, error);
        }

        // Posibilidad de que alguien responda a este comentario
        if (participantResponse && Math.random() > 0.6 && i < responseOrder.length - 1) {
          const reactor = responseOrder[i + 1];
          setTimeout(async () => {
            try {
              const reaction = await generateReaction(reactor, participant, participantResponse);
              setMessages(prev => [...prev, {
                participant_id: reactor.id,
                participant_name: reactor.name,
                message: reaction,
                timestamp: new Date(),
                reaction_to: participant.name
              }]);
            } catch (error) {
              console.error(`❌ Error generating reaction from ${reactor.name}:`, error);
            }
          }, 2000);
        }
        
        // Si es el último participante, el moderador puede hacer una pregunta de seguimiento
        if (i === responseOrder.length - 1 && evaluatedConcept) {
          setTimeout(() => {
            setIsWaitingForResponses(false);
            
            // Incrementar ronda y verificar si continuar
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            
            if (nextRound < totalRounds) {
              const followUpQuestions = [
                `Interesantes perspectivas. Ahora me gustaría profundizar en el precio. ¿Qué opinan sobre el costo de L ${evaluatedConcept.monthly_price?.toLocaleString() || '1,200'}?`,
                `Gracias por sus comentarios. ¿Cómo compararían este concepto con lo que ofrece la competencia?`,
                `Muy bueno. Cambiando de tema, ¿qué tan atractivo les resulta el nombre "${evaluatedConcept.name}"?`,
                `Perfecto. Una pregunta importante: ¿recomendarían este servicio a familiares y amigos? ¿Por qué sí o por qué no?`,
                `Excelente discusión. Para cerrar, ¿qué cambiarían o mejorarían del concepto?`,
                `¿Qué tan importante es para ustedes la tecnología 5G en su decisión de compra?`,
                `¿Cómo evaluarían el servicio al cliente propuesto comparado con sus experiencias actuales?`
              ];
              
              const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
              addModeratorMessage(followUp);
              
              // Simular nuevas respuestas más cortas
              setTimeout(() => {
                setIsWaitingForResponses(true);
                simulateFollowUpResponses(followUp);
              }, 1000);
            } else {
              // Fin del focus group
              addModeratorMessage('Gracias a todos por su participación y sus valiosos comentarios. Hemos concluido el focus group.');
              setIsRunning(false);
              isRunningRef.current = false;
            }
          }, 4000);
        }
      }, delay * (i + 1));
    }
  };

  const generateParticipantResponse = async (participant: FocusGroupParticipant, question: string): Promise<string> => {
    try {
      // Buscar el contexto de evaluación del participante
      const personaData = personas?.find(p => p.id === participant.id);
      const evaluationContext = personaData?.evaluation_context;
      
      // Crear el prompt para el focus group basado en el contexto
      const focusGroupPrompt = `Como moderador de focus group, necesito que ${participant.name} (${participant.segment}, ${participant.age} años, ${participant.location}) responda a la pregunta: "${question}".
      
      Contexto del Focus Group:
      - Tema: ${currentTopic}
      - Concepto evaluado: ${evaluatedConcept ? evaluatedConcept.name : 'No especificado'}
      
      Perfil del Participante:
      - Estilo de opinión: ${participant.opinion_style}
      - Segmento: ${participant.segment}
      - Personalidad: ${participant.personality}
      
      ${evaluationContext ? `
      Evaluación previa:
      - Score general: ${evaluationContext.overall_score}/100
      - Sentiment: ${evaluationContext.overall_sentiment}
      - Principales insights: ${evaluationContext.key_insights?.join(', ') || 'No especificados'}
      - Preocupaciones: ${evaluationContext.concerns?.join(', ') || 'No especificadas'}
      - Probabilidad de adopción: ${evaluationContext.likelihood_to_adopt}%
      - Probabilidad de recomendación: ${evaluationContext.likelihood_to_recommend}%
      ` : ''}
      
      Instrucciones:
      1. Responde SOLO como ${participant.name}, en primera persona
      2. Mantén su estilo de opinión (${participant.opinion_style})
      3. Usa lenguaje natural hondureño, conversacional
      4. Incluye detalles específicos de su evaluación previa si existe
      5. La respuesta debe ser de 2-4 oraciones, natural y auténtica
      6. Refleja su personalidad y contexto socioeconómico`;

      const llmResponse = await llmChatService.generateDynamicResponse({
        userMessage: focusGroupPrompt,
        archetype: participant.segment,
        evaluationContext: evaluationContext || {},
        conceptDetails: evaluatedConcept || {},
        conversationHistory: messages.slice(-5), // Últimas 5 conversaciones para contexto
        creativity: 80
      });

      if (llmResponse.success) {
        return llmResponse.response;
      } else {
        console.error('Error generando respuesta LLM:', llmResponse.error);
        // Fallback a respuesta simple si falla el LLM
        return `Como ${participant.name} de ${participant.location}, ${question.includes('precio') ? 'considero que el aspecto económico es muy importante' : 'tengo una perspectiva interesante sobre este tema'}. ${evaluationContext ? `Mi evaluación de ${evaluationContext.overall_score} puntos refleja mis sentimientos al respecto.` : 'Creo que hay varios aspectos a considerar.'}`;
      }
    } catch (error) {
      console.error('Error generando respuesta de participante:', error);
      // Fallback a respuesta básica
      return `Desde mi perspectiva como ${participant.segment} en ${participant.location}, creo que este tema merece una discusión profunda.`;
    }
  };

  const generateReaction = async (reactor: FocusGroupParticipant, original: FocusGroupParticipant, originalMessage: string): Promise<string> => {
    try {
      const reactionPrompt = `${reactor.name} quiere reaccionar al comentario de ${original.name} en el focus group.
      
      Comentario original de ${original.name}: "${originalMessage}"
      
      ${reactor.name} debe responder:
      - Como ${reactor.segment} de ${reactor.age} años en ${reactor.location}
      - Con estilo de opinión: ${reactor.opinion_style}
      - En 1-2 oraciones máximo
      - Debe ser una reacción natural, puede ser de acuerdo, desacuerdo parcial, o agregar un punto
      - Usar lenguaje conversacional hondureño`;

      const llmResponse = await llmChatService.generateDynamicResponse({
        userMessage: reactionPrompt,
        archetype: reactor.segment,
        evaluationContext: {},
        conceptDetails: evaluatedConcept || {},
        conversationHistory: messages.slice(-3),
        creativity: 70
      });

      if (llmResponse.success) {
        return llmResponse.response;
      } else {
        // Fallback simple
        return `Interesante punto, ${original.name}. Desde mi perspectiva también...`;
      }
    } catch (error) {
      console.error('Error generando reacción:', error);
      return `${original.name}, eso que mencionas es muy cierto...`;
    }
  };

  const simulateFollowUpResponses = async (question: string) => {
    if (!isRunningRef.current) return;

    // Respuestas más cortas y específicas
    const participantsToRespond = participants.slice(0, 3 + Math.floor(Math.random() * 2)); // 3-4 respuestas
    
    for (let i = 0; i < participantsToRespond.length; i++) {
      if (!isRunningRef.current) break;
      
      const participant = participantsToRespond[i];
      const delay = 2000 + Math.random() * 1500; // Respuestas más rápidas
      
      setTimeout(async () => {
        if (!isRunningRef.current) return;
        
        try {
          const response = await generateFollowUpResponse(participant, question);
          
          setMessages(prev => [...prev, {
            participant_id: participant.id,
            participant_name: participant.name,
            message: response,
            timestamp: new Date()
          }]);
        } catch (error) {
          console.error(`❌ Error generating follow-up response for ${participant.name}:`, error);
        }

        // Si es el último participante, verificar si continuar con más rondas
        if (i === participantsToRespond.length - 1) {
          setTimeout(() => {
            setIsWaitingForResponses(false);
            
            const nextRound = currentRound + 1;
            setCurrentRound(nextRound);
            
            if (nextRound < totalRounds && isRunningRef.current) {
              // Generar siguiente pregunta automática
              const followUpQuestions = [
                `¿Qué otros aspectos consideran importantes que no hemos discutido?`,
                `¿Cómo ven este concepto en el contexto actual del mercado hondureño?`,
                `¿Qué experiencias personales tienen con servicios similares?`,
                `Si pudieran cambiar una cosa del concepto, ¿cuál sería?`,
                `¿Qué tan realistas consideran las promesas del servicio?`
              ];
              
              const nextQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
              addModeratorMessage(nextQuestion);
              
              setTimeout(() => {
                setIsWaitingForResponses(true);
                simulateFollowUpResponses(nextQuestion);
              }, 1500);
            } else if (nextRound >= totalRounds) {
              // Fin del focus group
              addModeratorMessage('Excelente discusión. Gracias a todos por sus valiosos aportes. Hemos concluido el focus group.');
              setIsRunning(false);
              isRunningRef.current = false;
            }
          }, 2000);
        }
      }, delay * (i + 1));
    }
  };

  const generateFollowUpResponse = async (participant: FocusGroupParticipant, question: string): Promise<string> => {
    // Reutilizar la función principal pero con un prompt más corto para follow-up
    return await generateParticipantResponse(participant, `Pregunta de seguimiento: ${question}`);
  };

  const sendManualQuestion = () => {
    if (!manualQuestion.trim() || isWaitingForResponses) return;
    
    // Agregar la pregunta del moderador
    addModeratorMessage(manualQuestion);
    setIsWaitingForResponses(true);
    
    // Incrementar ronda
    setCurrentRound(prev => prev + 1);
    
    // Simular respuestas
    simulateResponses(manualQuestion);
    
    // Limpiar el input
    setManualQuestion('');
  };

  const stopFocusGroup = () => {
    console.log('🛑 Stopping focus group...');
    setIsRunning(false);
    isRunningRef.current = false;
    addModeratorMessage('Gracias a todos por su participación. Hemos concluido el focus group.');
  };

  const exportTranscript = () => {
    const transcript = {
      topic: currentTopic,
      date: new Date().toISOString(),
      duration: sessionConfig.duration_minutes,
      participants: participants,
      messages: messages,
      summary: {
        total_messages: messages.length,
        participant_count: participants.length,
        key_themes: extractKeyThemes()
      }
    };

    const dataStr = JSON.stringify(transcript, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `focus-group-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const extractKeyThemes = () => {
    // Análisis simple de temas frecuentes
    const themes = ['precio', 'cobertura', 'servicio', 'velocidad', 'calidad'];
    return themes.filter(theme => 
      messages.some(m => m.message.toLowerCase().includes(theme))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Focus Group: {evaluatedConcept ? `"${evaluatedConcept.name}"` : 'Simulador'}
              </h2>
              <p className="text-sm text-gray-600">
                {evaluatedConcept 
                  ? `Discusión grupal sobre el concepto evaluado • ${participants.length} participantes`
                  : 'Simula conversaciones grupales con personas sintéticas'
                }
              </p>
              {evaluatedConcept && (
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {evaluatedConcept.type === 'campaign' ? 'Campaña' : 'Producto'}
                  </span>
                  {evaluatedConcept.monthly_price && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      L {evaluatedConcept.monthly_price.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Participants */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-medium text-gray-900 mb-3">Participantes ({participants.length})</h3>
            <div className="space-y-2">
              {participants.map(participant => {
                const personaData = personas?.find(p => p.id === participant.id);
                const evaluationContext = personaData?.evaluation_context;
                
                return (
                  <div key={participant.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-purple-400">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-600">
                          {participant.age} años • {participant.location}
                        </p>
                        <p className="text-xs text-purple-600 font-medium">{participant.segment}</p>
                        
                        {evaluationContext && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Score:</span>
                              <span className={`text-xs font-bold ${
                                evaluationContext.overall_score > 70 ? 'text-green-600' :
                                evaluationContext.overall_score > 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {evaluationContext.overall_score}/100
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">Adopción:</span>
                              <span className="text-xs text-blue-600 font-medium">
                                {evaluationContext.likelihood_to_adopt || 0}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {participant.is_speaking && (
                        <Mic className="h-3 w-3 text-green-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Configuration */}
            {!isRunning && messages.length === 0 && (
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema de Discusión
                    </label>
                    <select
                      value={currentTopic}
                      onChange={(e) => setCurrentTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecciona un tema...</option>
                      {predefinedTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primera Pregunta del Moderador
                    </label>
                    <input
                      type="text"
                      value={moderatorQuestion}
                      onChange={(e) => setModeratorQuestion(e.target.value)}
                      placeholder="Ej: ¿Qué opinan sobre...?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Rondas de Preguntas
                      </label>
                      <select
                        value={totalRounds}
                        onChange={(e) => setTotalRounds(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={2}>2 rondas (corto)</option>
                        <option value={3}>3 rondas (estándar)</option>
                        <option value={5}>5 rondas (detallado)</option>
                        <option value={8}>8 rondas (exhaustivo)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo Estimado
                      </label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg">
                        <span className="text-gray-600">~{totalRounds * 3} minutos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 && !isRunning ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Configura el tema y comienza el focus group</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={cn(
                      "flex gap-3",
                      msg.participant_id === 'moderator' && "bg-purple-50 -mx-4 px-4 py-2 rounded-lg"
                    )}>
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium",
                          msg.participant_id === 'moderator' ? "bg-purple-600" : "bg-gray-500"
                        )}>
                          {msg.participant_name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-gray-900">
                            {msg.participant_name}
                          </span>
                          {msg.reaction_to && (
                            <span className="text-xs text-gray-500">
                              respondiendo a {msg.reaction_to}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              {/* Input para preguntas manuales cuando está activo */}
              {isRunning && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualQuestion}
                    onChange={(e) => setManualQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendManualQuestion()}
                    placeholder="Escriba una pregunta como moderador..."
                    disabled={isWaitingForResponses}
                    className={cn(
                      "flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500",
                      isWaitingForResponses ? "bg-gray-100 text-gray-500" : "border-gray-300"
                    )}
                  />
                  <button
                    onClick={sendManualQuestion}
                    disabled={!manualQuestion.trim() || isWaitingForResponses}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-colors",
                      !manualQuestion.trim() || isWaitingForResponses
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    )}
                  >
                    Preguntar
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!isRunning ? (
                    <button
                      onClick={startFocusGroup}
                      disabled={!currentTopic}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                        currentTopic
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      <Play className="h-4 w-4" />
                      Iniciar Focus Group
                    </button>
                  ) : (
                    <button
                      onClick={stopFocusGroup}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      <Pause className="h-4 w-4" />
                      Detener
                    </button>
                  )}

                  {messages.length > 0 && (
                    <button
                      onClick={exportTranscript}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4" />
                      Exportar Transcripción
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {isRunning && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Ronda {currentRound + 1} de {totalRounds}</span>
                      {isWaitingForResponses && <span className="text-xs">(esperando respuestas...)</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {messages.length} mensajes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusGroupSimulator;