// services/tigoLLMService.ts - Servicio LLM específico para personas sintéticas TIGO Honduras

import type { SyntheticPersona, TigoLLMRequest, TigoLLMResponse } from '../types/tigoPersona.types';


class TigoLLMService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async generatePersonaResponse({
    userMessage,
    persona,
    productContext,
    conversationHistory = []
  }: TigoLLMRequest): Promise<TigoLLMResponse> {
    
    try {
      const token = localStorage.getItem('tigo_auth_token');

      // Construir prompt específico para Tigo Honduras con contexto telecom
      const systemPrompt = this.buildTigoHonduranSystemPrompt(persona, productContext);
      
      const response = await fetch(`${this.baseUrl}/api/rag-creative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          text: userMessage,
          system_prompt: systemPrompt,
          conversation_history: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          })),
          metadata_filter: {
            persona_id: persona.id,
            archetype: persona.archetype,
            region: this.mapCityToRegion(persona.characteristics.location.city),
            nse: persona.characteristics.demographics.nse
          },
          output_types: ['text'],
          temperature: 0.75, // Balanceado para respuestas naturales pero consistentes
          max_tokens: 400,
          creativity_level: 65, // Específico para telecomunicaciones
          cultural_context: 'honduras_telecom',
          product_context: productContext || {
            campaign: 'tigo_general',
            service: 'telecomunicaciones',
            telecom_context: 'servicios_honduras'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.answer || data.response || data.text || '',
        persona_insights: {
          archetype_influence: this.getArchetypeInfluence(persona.archetype),
          regional_context: this.getRegionalContextDescription(persona.characteristics.location.city),
          telecom_relevance: this.assessTelecomRelevance(persona, productContext)
        },
        suggested_follow_ups: this.generateTigoFollowUps(persona, productContext),
        confidence_score: data.confidence_score || 0.8
      };

    } catch (error) {
      console.error('Error en Tigo LLM Service:', error);
      
      // Respuesta de fallback específica para Tigo Honduras
      return {
        response: this.getFallbackResponse(persona),
        persona_insights: {
          archetype_influence: 'Error en procesamiento',
          regional_context: 'No disponible',
          telecom_relevance: 'No evaluado'
        },
        suggested_follow_ups: [
          '¿Qué opinas de los servicios de Tigo?',
          '¿Cómo usas tu teléfono móvil?',
          '¿Qué es más importante para vos en telecomunicaciones?'
        ],
        confidence_score: 0.3
      };
    }
  }

  private buildTigoHonduranSystemPrompt(persona: SyntheticPersona, productContext?: any): string {
    const demographics = persona.characteristics.demographics;
    const psychographics = persona.characteristics.psychographics;
    const location = persona.characteristics.location;
    
    return `Eres ${persona.name}, una persona real de ${location.city}, Honduras. 

PERFIL PERSONAL:
- Edad: ${demographics.age} años
- Ocupación: ${demographics.occupation}
- NSE: ${demographics.nse} (Ingreso mensual: L.${demographics.monthly_income.toLocaleString()})
- Familia: ${demographics.family_status}
- Educación: ${demographics.education_level}

CONTEXTO HONDUREÑO ESPECÍFICO:
- Vives en: ${location.city}, ${this.mapCityToRegion(location.city)}
- Tu zona: ${location.neighborhood || 'centro de la ciudad'}
- Expresiones típicas: ${this.getRegionalExpressions(location.city)}
- Contexto económico: ${this.getEconomicContext(demographics.nse)}

PERFIL TELECOM Y TECNOLÓGICO:
- Arquetipo: ${persona.archetype} - ${this.getArchetypeDescription(persona.archetype)}
- Uso de tecnología: ${psychographics.tech_adoption}
- Sensibilidad al precio: ${psychographics.price_sensitivity}
- Canales preferidos: ${psychographics.preferred_channels.join(', ')}
- Gasto telecom actual: L.${demographics.current_telecom_spend}/mes

PERSONALIDAD Y COMUNICACIÓN:
- Estilo de vida: ${psychographics.lifestyle}
- Valores: ${psychographics.values.join(', ')}
- Preocupaciones principales: ${psychographics.main_concerns.join(', ')}
- Motivaciones: ${psychographics.motivations.join(', ')}

CONTEXTO TIGO ESPECÍFICO:
- Eres un hondureño real que vive la experiencia de telecomunicaciones
- Hablas con el acento y modismos de ${location.city}
- Tu perspectiva está influenciada por tu realidad socioeconómica NSE ${demographics.nse}
- Conoces la realidad de los servicios telecom en Honduras

INSTRUCCIONES DE CONVERSACIÓN:
1. Responde SOLO desde tu perspectiva personal como ${persona.name}
2. Usa expresiones hondureñas naturalmente: ${this.getRegionalExpressions(location.city).slice(0, 3).join(', ')}
3. Habla de TU experiencia con servicios de telecomunicaciones
4. Menciona aspectos específicos de tu vida en ${location.city}
5. Si no tienes experiencia personal con algo, dilo honestamente
6. Refleja tu nivel socioeconómico en tus respuestas
7. Mantén coherencia con tu arquetipo ${persona.archetype}
8. Habla como alguien de tu edad (${demographics.age} años) y ocupación (${demographics.occupation})`;
  }

  private mapCityToRegion(city: string): string {
    const regionMap: Record<string, string> = {
      'Tegucigalpa': 'Región Central',
      'San Pedro Sula': 'Región Norte',
      'La Ceiba': 'Región Costa Norte',
      'Choloma': 'Región Valle de Sula',
      'El Progreso': 'Región Norte',
      'Comayagua': 'Región Central',
      'Puerto Cortés': 'Región Costa Norte',
      'Danlí': 'Región Oriental',
      'Siguatepeque': 'Región Central',
      'Santa Rosa de Copán': 'Región Occidental',
      'Juticalpa': 'Región Oriental',
      'Catacamas': 'Región Oriental',
      'Yoro': 'Región Norte'
    };
    
    return regionMap[city] || 'Región Central';
  }

  private getRegionalExpressions(city: string): string[] {
    const expressions: Record<string, string[]> = {
      'Tegucigalpa': ['¡Órale!', '¡Qué tal!', 'Está bueno', 'Pues sí', '¡Híjole!'],
      'San Pedro Sula': ['¡Epa!', '¡Qué ondas!', 'Está chivo', 'Pues claro', '¡Ándale!'],
      'La Ceiba': ['¡Ey!', '¡Qué hay!', 'Está cool', 'Sí pues', '¡Dale!'],
      'default': ['¡Órale!', '¡Qué tal!', 'Está bueno', 'Pues sí']
    };
    
    return expressions[city] || expressions.default;
  }

  private getEconomicContext(nse: string): string {
    const contexts: Record<string, string> = {
      'A': 'Ingresos altos, acceso a servicios premium, menos sensible al precio',
      'B': 'Ingresos medios-altos, busca calidad-precio, selectivo en gastos',
      'C+': 'Ingresos medios, evalúa cuidadosamente gastos, busca promociones',
      'C': 'Ingresos básicos, muy sensible al precio, busca lo esencial',
      'C-': 'Ingresos limitados, extrema sensibilidad al precio, necesidades básicas',
      'D': 'Ingresos muy limitados, cada lempira cuenta, servicios básicos únicamente'
    };
    
    return contexts[nse] || contexts['C'];
  }

  private getArchetypeDescription(archetype: string): string {
    const descriptions: Record<string, string> = {
      'PROFESIONAL': 'Valora eficiencia, calidad y servicios empresariales',
      'CONTROLADOR': 'Busca control de gastos, transparencia y servicios familiares',
      'EMPRENDEDOR': 'Necesita servicios que apoyen su negocio y crecimiento',
      'GOMOSO_EXPLORADOR': 'Le gustan las innovaciones, redes sociales y tecnología',
      'PRAGMATICO': 'Busca lo esencial, simplicidad y mejor precio',
      'RESIGNADO': 'Acepta lo básico, resistente a cambios, precio muy importante'
    };
    
    return descriptions[archetype] || 'Consumidor general de telecomunicaciones';
  }

  private getArchetypeInfluence(archetype: string): string {
    const influences: Record<string, string> = {
      'PROFESIONAL': 'Prioriza servicios empresariales, cobertura confiable, soporte técnico',
      'CONTROLADOR': 'Busca control de gastos familiares, planes transparentes, sin sorpresas',
      'EMPRENDEDOR': 'Valora servicios que apoyen su negocio, flexibilidad, herramientas digitales',
      'GOMOSO_EXPLORADOR': 'Le interesan innovaciones, redes sociales, aplicaciones, tendencias',
      'PRAGMATICO': 'Prefiere servicios básicos, mejor precio-calidad, simplicidad',
      'RESIGNADO': 'Acepta servicios básicos, muy sensible al precio, resistente a cambios'
    };
    
    return influences[archetype] || 'Consumidor general de telecomunicaciones';
  }

  private getRegionalContextDescription(city: string): string {
    return `Perspectiva desde ${city}, ${this.mapCityToRegion(city)} - ${this.getRegionalExpressions(city).join(', ')}`;
  }

  private assessTelecomRelevance(persona: SyntheticPersona, productContext?: any): string {
    const archetype = persona.archetype;
    const nse = persona.characteristics.demographics.nse;
    
    if (!productContext) return `Relevante para ${archetype} NSE ${nse} en servicios telecom generales`;
    
    const concept = productContext.campaign || productContext.service || 'concepto';
    return `Evaluando ${concept} para ${archetype} NSE ${nse}`;
  }

  private generateTigoFollowUps(persona: SyntheticPersona, _productContext?: any): string[] {
    const baseQuestions = [
      '¿Cómo es tu experiencia con los servicios de telecomunicaciones?',
      '¿Qué es lo más importante para vos en un plan móvil?',
      '¿Cómo usas tu teléfono en el día a día?'
    ];

    // Personalizar según arquetipo
    const archetypeQuestions: Record<string, string[]> = {
      'PROFESIONAL': [
        '¿Qué servicios empresariales necesitas de Tigo?',
        '¿Cómo afecta la calidad de señal a tu trabajo?',
        '¿Usas servicios de datos para tu profesión?'
      ],
      'CONTROLADOR': [
        '¿Cómo controlas el gasto familiar en telecomunicaciones?',
        '¿Qué te preocupa más de los planes móviles?',
        '¿Cómo decides qué plan conviene a tu familia?'
      ],
      'EMPRENDEDOR': [
        '¿Cómo usas los servicios móviles para tu negocio?',
        '¿Qué herramientas digitales necesitas?',
        '¿Te ayudan las redes sociales en tu emprendimiento?'
      ],
      'GOMOSO_EXPLORADOR': [
        '¿Qué aplicaciones usas más en tu teléfono?',
        '¿Te interesan las nuevas funciones de Tigo?',
        '¿Cómo compartes contenido en redes sociales?'
      ],
      'PRAGMATICO': [
        '¿Qué es lo básico que necesitas de tu plan?',
        '¿Cómo comparas precios entre operadores?',
        '¿Qué servicios consideras innecesarios?'
      ],
      'RESIGNADO': [
        '¿Qué tan satisfecho estás con tu servicio actual?',
        '¿Te resulta complicado cambiar de operador?',
        '¿Qué mejorarías de los servicios básicos?'
      ]
    };

    const specificQuestions = archetypeQuestions[persona.archetype] || baseQuestions;
    return [...baseQuestions.slice(0, 1), ...specificQuestions.slice(0, 2)];
  }

  private getFallbackResponse(persona: SyntheticPersona): string {
    const expressions = this.getRegionalExpressions(persona.characteristics.location.city);
    const greeting = expressions[0] || '¡Hola!';
    
    return `${greeting} Soy ${persona.name} de ${persona.characteristics.location.city}. Disculpá, pero tengo problemas técnicos ahora mismo. 
    
Como ${persona.characteristics.demographics.occupation} de NSE ${persona.characteristics.demographics.nse}, normalmente puedo contarte sobre mi experiencia con servicios de telecomunicaciones en Honduras. 
    
¿Podrías preguntarme de nuevo en un ratito?`;
  }

  // Método para validar que el backend esté disponible
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const tigoLLMService = new TigoLLMService();