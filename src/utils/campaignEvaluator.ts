// utils/campaignEvaluator.ts - Generador de evaluaciones de campaña por arquetipo

import type { CampaignConcept, SegmentReaction, VariableReaction } from '../types/campaign.types';
import { TigoArchetype } from '../types/persona.types';
import { AuthenticConversationEngine } from './authenticConversationEngine';
import { ECONOMIC_SEGMENTS } from '../data/hondurasKnowledgeBase';

// Base de conocimiento de cada arquetipo
const ARCHETYPE_PROFILES = {
  [TigoArchetype.PROFESIONAL]: {
    name_preferences: ['profesional', 'empresarial', 'premium', 'pro', 'ejecutivo'],
    price_sensitivity: 0.3, // Baja sensibilidad al precio
    innovation_openness: 0.8, // Alta apertura a innovación  
    brand_importance: 0.9, // Muy importante la marca
    typical_concerns: ['tiempo de implementación', 'compatibilidad', 'soporte técnico', 'ROI'],
    preferred_channels: ['digital', 'email', 'LinkedIn'],
    decision_factors: ['eficiencia', 'calidad', 'prestigio', 'funcionalidad avanzada']
  },
  [TigoArchetype.CONTROLADOR]: {
    name_preferences: ['familia', 'hogar', 'control', 'seguro', 'confiable'],
    price_sensitivity: 0.8, // Alta sensibilidad al precio
    innovation_openness: 0.4, // Moderada apertura
    brand_importance: 0.7, // Importante pero no crítico
    typical_concerns: ['costos ocultos', 'términos y condiciones', 'cancelación', 'incrementos'],
    preferred_channels: ['punto de venta', 'call center', 'familiar'],
    decision_factors: ['precio', 'transparencia', 'garantías', 'control']
  },
  [TigoArchetype.EMPRENDEDOR]: {
    name_preferences: ['negocio', 'empresario', 'growth', 'flex', 'pro'],
    price_sensitivity: 0.6, // Moderada sensibilidad
    innovation_openness: 0.7, // Buena apertura
    brand_importance: 0.6, // Moderada importancia
    typical_concerns: ['escalabilidad', 'interrupciones', 'soporte', 'ROI'],
    preferred_channels: ['digital', 'WhatsApp Business', 'redes sociales'],
    decision_factors: ['flexibilidad', 'herramientas de negocio', 'escalabilidad', 'soporte']
  },
  [TigoArchetype.GOMOSO_EXPLORADOR]: {
    name_preferences: ['cool', 'trendy', 'smart', 'new', 'style'],
    price_sensitivity: 0.5, // Moderada sensibilidad
    innovation_openness: 0.9, // Muy alta apertura
    brand_importance: 0.8, // Alta importancia del "cool factor"
    typical_concerns: ['que sea mainstream', 'personalización limitada', 'exclusividad'],
    preferred_channels: ['Instagram', 'TikTok', 'influencers', 'stories'],
    decision_factors: ['innovación', 'estética', 'compartibilidad', 'tendencia']
  },
  [TigoArchetype.PRAGMATICO]: {
    name_preferences: ['simple', 'básico', 'esencial', 'fácil', 'directo'],
    price_sensitivity: 0.9, // Muy alta sensibilidad
    innovation_openness: 0.3, // Baja apertura
    brand_importance: 0.5, // Moderada importancia
    typical_concerns: ['complejidad', 'precio-valor', 'necesidad real'],
    preferred_channels: ['punto de venta', 'radio', 'recomendación'],
    decision_factors: ['simplicidad', 'precio', 'utilidad clara', 'confiabilidad']
  },
  [TigoArchetype.RESIGNADO]: {
    name_preferences: ['tradicional', 'conocido', 'familiar', 'simple'],
    price_sensitivity: 0.95, // Extrema sensibilidad
    innovation_openness: 0.1, // Muy baja apertura
    brand_importance: 0.3, // Baja importancia
    typical_concerns: ['cambio', 'complejidad', 'pérdida de lo conocido', 'costos'],
    preferred_channels: ['punto de venta', 'familia', 'radio', 'boca a boca'],
    decision_factors: ['familiaridad', 'precio bajo', 'simplicidad extrema', 'soporte']
  }
};

// Nombres y contextos realistas para cada arquetipo (basado en datos RAG)
const PERSONA_CONTEXTS = {
  [TigoArchetype.PROFESIONAL]: [
    { name: 'Carlos Eduardo Martínez', age: 38, city: 'Tegucigalpa', occupation: 'Gerente de Ventas', nse: 'C+', monthly_income: 22000 },
    { name: 'María José Restrepo', age: 42, city: 'San Pedro Sula', occupation: 'Directora Financiera', nse: 'B', monthly_income: 35000 },
    { name: 'Roberto Antonio Díaz', age: 35, city: 'Tegucigalpa', occupation: 'Consultor IT', nse: 'C+', monthly_income: 28000 }
  ],
  [TigoArchetype.CONTROLADOR]: [
    { name: 'Ana Isabel Rodríguez', age: 45, city: 'San Pedro Sula', occupation: 'Administradora del Hogar', nse: 'C', monthly_income: 12000 },
    { name: 'Patricia Elena Flores', age: 38, city: 'Comayagua', occupation: 'Contadora', nse: 'C+', monthly_income: 18000 },
    { name: 'Carmen Leticia Torres', age: 52, city: 'La Ceiba', occupation: 'Supervisora Administrativa', nse: 'C', monthly_income: 14000 }
  ],
  [TigoArchetype.EMPRENDEDOR]: [
    { name: 'José Manuel Mejía', age: 33, city: 'Choloma', occupation: 'Dueño de Taller Mecánico', nse: 'C', monthly_income: 13000 },
    { name: 'Sandra Gabriela López', age: 29, city: 'El Progreso', occupation: 'Propietaria de Boutique', nse: 'C+', monthly_income: 16000 },
    { name: 'Luis Fernando Castro', age: 41, city: 'Danlí', occupation: 'Distribuidor de Productos', nse: 'C', monthly_income: 11000 }
  ],
  [TigoArchetype.GOMOSO_EXPLORADOR]: [
    { name: 'Andrea Sofia Castillo', age: 24, city: 'Tegucigalpa', occupation: 'Diseñadora Gráfica', nse: 'C+', monthly_income: 17000 },
    { name: 'Kevin Alexander Morales', age: 27, city: 'San Pedro Sula', occupation: 'Content Creator', nse: 'C', monthly_income: 12000 },
    { name: 'Melissa Paola Hernández', age: 22, city: 'La Ceiba', occupation: 'Estudiante de Marketing', nse: 'C-', monthly_income: 8000 }
  ],
  [TigoArchetype.PRAGMATICO]: [
    { name: 'Luis Fernando Paz', age: 36, city: 'Santa Rosa de Copán', occupation: 'Técnico Electricista', nse: 'C-', monthly_income: 9000 },
    { name: 'Gloria María Sánchez', age: 43, city: 'Siguatepeque', occupation: 'Secretaria', nse: 'C', monthly_income: 11000 },
    { name: 'Mario Roberto Aguilar', age: 39, city: 'Puerto Cortés', occupation: 'Conductor', nse: 'C-', monthly_income: 8500 }
  ],
  [TigoArchetype.RESIGNADO]: [
    { name: 'Pedro José Martínez', age: 58, city: 'Juticalpa', occupation: 'Agricultor', nse: 'D', monthly_income: 6000 },
    { name: 'Rosa Amelia González', age: 62, city: 'Catacamas', occupation: 'Ama de Casa', nse: 'D', monthly_income: 5500 },
    { name: 'Francisco Javier Urbina', age: 55, city: 'Yoro', occupation: 'Comerciante', nse: 'D', monthly_income: 6500 }
  ]
};

export class CampaignEvaluator {
  static async evaluateConcept(
    concept: CampaignConcept, 
    selectedArchetypes: string[]
  ): Promise<SegmentReaction[]> {
    const reactions: SegmentReaction[] = [];

    for (const archetype of selectedArchetypes) {
      const reaction = await this.generateArchetypeReaction(concept, archetype);
      reactions.push(reaction);
    }

    return reactions;
  }

  private static async generateArchetypeReaction(
    concept: CampaignConcept, 
    archetype: string
  ): Promise<SegmentReaction> {
    const contexts = PERSONA_CONTEXTS[archetype as keyof typeof PERSONA_CONTEXTS];
    const basePersonaContext = contexts[Math.floor(Math.random() * contexts.length)];
    
    // Extend persona context with required fields
    const personaContext = {
      ...basePersonaContext,
      archetype,
      current_telecom_spend: ECONOMIC_SEGMENTS[this.mapNSEToSegment(basePersonaContext.nse)].typical_telecom_spend[0]
    };

    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Usar el motor conversacional auténtico para generar reacciones
    const variableReactions = {
      name: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'name',
        concept,
        persona: personaContext
      }),
      description: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'description',
        concept,
        persona: personaContext
      }),
      benefits: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'benefits',
        concept,
        persona: personaContext
      }),
      differentiation: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'differentiation',
        concept,
        persona: personaContext
      }),
      price: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'price',
        concept,
        persona: personaContext
      }),
      target_audience: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'target_audience',
        concept,
        persona: personaContext
      }),
      channel: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'channel',
        concept,
        persona: personaContext
      }),
      tone: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'tone',
        concept,
        persona: personaContext
      }),
      call_to_action: AuthenticConversationEngine.generateAuthenticReaction({
        variable: 'call_to_action',
        concept,
        persona: personaContext
      })
    };

    // Calcular score general
    const scores = Object.values(variableReactions).map(v => v.score);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Determinar sentiment general
    const overallSentiment = this.scoresToSentiment(overallScore);

    return {
      archetype,
      overall_sentiment: overallSentiment,
      overall_score: overallScore,
      variable_reactions: variableReactions,
      key_insights: this.generateAuthenticInsights(concept, archetype, personaContext, variableReactions),
      concerns: this.generateAuthenticConcerns(concept, archetype, personaContext),
      suggestions: this.generateAuthenticSuggestions(concept, archetype, personaContext, variableReactions),
      likelihood_to_adopt: this.calculateLikelihoodToAdopt(overallScore, personaContext),
      likelihood_to_recommend: this.calculateLikelihoodToRecommend(overallScore, personaContext),
      persona_context: {
        name: basePersonaContext.name,
        age: basePersonaContext.age,
        city: basePersonaContext.city,
        occupation: basePersonaContext.occupation
      }
    };
  }


  private static scoresToSentiment(score: number): 'muy_positivo' | 'positivo' | 'neutral' | 'negativo' | 'muy_negativo' {
    if (score >= 80) return 'muy_positivo';
    if (score >= 60) return 'positivo';
    if (score >= 40) return 'neutral';
    if (score >= 20) return 'negativo';
    return 'muy_negativo';
  }






  private static calculateLikelihoodToAdopt(overallScore: number, profile: any): number {
    const baseAdoption = overallScore;
    const innovationFactor = profile.innovation_openness * 20;
    const priceResistance = profile.price_sensitivity * -10;
    
    return Math.max(0, Math.min(100, Math.round(baseAdoption + innovationFactor + priceResistance)));
  }

  private static calculateLikelihoodToRecommend(overallScore: number, profile: any): number {
    const baseRecommendation = overallScore * 0.8; // Más conservador que adopción
    const brandImportance = profile.brand_importance * 15;
    
    return Math.max(0, Math.min(100, Math.round(baseRecommendation + brandImportance)));
  }

  private static generateAuthenticInsights(
    concept: CampaignConcept, 
    archetype: string, 
    personaContext: any,
    reactions: any
  ): string[] {
    const insights = [];
    const economicData = ECONOMIC_SEGMENTS[this.mapNSEToSegment(personaContext.nse)];
    
    // Insight basado en el score más alto
    const highestVar = Object.entries(reactions).reduce((a, b) => 
      (reactions[a[0] as keyof typeof reactions] as VariableReaction).score > (reactions[b[0] as keyof typeof reactions] as VariableReaction).score ? a : b
    )[0];
    
    insights.push(`Su fortaleza principal es ${highestVar}: conecta muy bien con este segmento`);
    
    // Insights específicos por arquetipo basados en datos reales RAG
    if (archetype === TigoArchetype.PROFESIONAL) {
      insights.push(`Con ingresos de L${economicData.monthly_income_range[0].toLocaleString()}-${economicData.monthly_income_range[1].toLocaleString()}, valora eficiencia sobre precio`);
      insights.push('Prefiere canales digitales profesionales como LinkedIn y email corporativo');
      if (concept.monthly_price && concept.monthly_price > 1000) {
        insights.push('El precio está dentro del rango aceptable para su perfil de alta productividad');
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      insights.push(`Administra un presupuesto familiar promedio de L${economicData.monthly_income_range[0].toLocaleString()}-${economicData.monthly_income_range[1].toLocaleString()}`);
      insights.push('La transparencia en precios y términos es fundamental para su decisión');
      insights.push('Las garantías y políticas de cancelación flexibles generan confianza');
    } else if (archetype === TigoArchetype.EMPRENDEDOR) {
      insights.push(`Busca herramientas que generen ROI directo en su negocio (ingresos L${economicData.monthly_income_range[0].toLocaleString()}-${economicData.monthly_income_range[1].toLocaleString()})`);
      insights.push('WhatsApp Business y redes sociales son canales críticos para su operación');
      insights.push('Evalúa todo en términos de impacto en ventas y atención al cliente');
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      insights.push('Busca exclusividad y factor "wow" para compartir en redes sociales');
      insights.push('Es early adopter y influencer en su círculo social digital');
      insights.push('Instagram, TikTok y YouTube son sus canales naturales de validación');
    } else if (archetype === TigoArchetype.PRAGMATICO) {
      insights.push(`Con presupuesto limitado (L${economicData.monthly_income_range[0].toLocaleString()}-${economicData.monthly_income_range[1].toLocaleString()}), prioriza funcionalidad básica`);
      insights.push('Prefiere servicios simples sin complejidades técnicas');
      insights.push('WhatsApp y llamadas son sus necesidades principales');
    } else if (archetype === TigoArchetype.RESIGNADO) {
      insights.push(`Muy sensible al precio con ingresos limitados (L${economicData.monthly_income_range[0].toLocaleString()}-${economicData.monthly_income_range[1].toLocaleString()})`); 
      insights.push('Requiere soporte familiar en decisiones tecnológicas');
      insights.push('Radio, TV y recomendaciones familiares son sus fuentes de información');
    }
    
    return insights.slice(0, 3);
  }

  private static generateAuthenticConcerns(
    concept: CampaignConcept, 
    archetype: string, 
    personaContext: any
  ): string[] {
    const concerns = [];
    const economicData = ECONOMIC_SEGMENTS[this.mapNSEToSegment(personaContext.nse)];
    const profile = ARCHETYPE_PROFILES[archetype as keyof typeof ARCHETYPE_PROFILES];
    
    // Preocupaciones básicas del arquetipo
    concerns.push(...profile.typical_concerns.slice(0, 2));
    
    // Preocupaciones específicas basadas en el concepto y contexto económico
    if (concept.monthly_price) {
      const pricePercentage = (concept.monthly_price / ((economicData.monthly_income_range[0] + economicData.monthly_income_range[1]) / 2)) * 100;
      
      if (pricePercentage > 5) {
        concerns.push(`El precio (L${concept.monthly_price}) representa ${pricePercentage.toFixed(1)}% de su ingreso mensual`);
      }
      
      if (archetype === TigoArchetype.CONTROLADOR && pricePercentage > 4) {
        concerns.push('Preocupación por incrementos futuros no informados');
      }
    }
    
    // Preocupaciones por ubicación geográfica
    if (personaContext.city.includes('rural') || !['Tegucigalpa', 'San Pedro Sula'].some(city => personaContext.city.includes(city))) {
      concerns.push('Calidad de cobertura en su zona geográfica');
    }
    
    // Preocupaciones específicas por arquetipo
    if (archetype === TigoArchetype.PROFESIONAL) {
      concerns.push('Tiempo de implementación y compatibilidad con sistemas existentes');
    } else if (archetype === TigoArchetype.RESIGNADO) {
      concerns.push('Complejidad de uso y necesidad de soporte técnico');
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      concerns.push('Que el producto se vuelva mainstream y pierda exclusividad');
    }
    
    return concerns.slice(0, 4);
  }

  private static generateAuthenticSuggestions(
    concept: CampaignConcept, 
    archetype: string, 
    personaContext: any,
    reactions: any
  ): string[] {
    const suggestions = [];
    const economicData = ECONOMIC_SEGMENTS[this.mapNSEToSegment(personaContext.nse)];
    
    // Sugerencias basadas en scores bajos
    const lowScoreVars = Object.entries(reactions).filter(
      ([_, reaction]) => (reaction as VariableReaction).score < 50
    );
    
    lowScoreVars.forEach(([, reaction]) => {
      const varReaction = reaction as VariableReaction;
      if (varReaction.improvement_suggestion) {
        suggestions.push(varReaction.improvement_suggestion);
      }
    });
    
    // Sugerencias específicas por arquetipo y contexto económico
    if (archetype === TigoArchetype.CONTROLADOR) {
      if (concept.monthly_price && concept.monthly_price > economicData.typical_telecom_spend[1]) {
        suggestions.push('Ofrecer planes familiares con descuentos o opciones de financiamiento');
      }
      suggestions.push('Incluir garantía de satisfacción y política de cancelación flexible');
    } else if (archetype === TigoArchetype.PROFESIONAL) {
      suggestions.push('Desarrollar caso de negocio específico con métricas de ROI y productividad');
      suggestions.push('Ofrecer período de prueba gratuito para evaluación corporativa');
    } else if (archetype === TigoArchetype.EMPRENDEDOR) {
      suggestions.push('Mostrar casos de éxito de otros emprendedores hondureños');
      suggestions.push('Incluir herramientas específicas de WhatsApp Business y pagos móviles');
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      suggestions.push('Crear programa de early adopters con beneficios exclusivos');
      suggestions.push('Desarrollar contenido específico para Instagram Stories y TikTok');
    } else if (archetype === TigoArchetype.PRAGMATICO) {
      suggestions.push('Simplificar la oferta enfocándose solo en beneficios esenciales');
      suggestions.push('Ofrecer versión básica más económica sin funciones avanzadas');
    }
    
    return suggestions.filter(Boolean).slice(0, 3);
  }

  private static mapNSEToSegment(nse: string): string {
    const nseMap: Record<string, string> = {
      'A': 'NSE_AB', 'B': 'NSE_AB', 'C+': 'NSE_C_PLUS',
      'C': 'NSE_C', 'C-': 'NSE_C_MINUS', 'D': 'NSE_D'
    };
    return nseMap[nse] || 'NSE_C';
  }
}