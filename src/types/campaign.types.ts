// types/campaign.types.ts - Tipos para evaluación de campañas y conceptos

export interface CampaignConcept {
  id: string;
  type: 'campaign' | 'product_concept';
  name: string;
  description: string;
  benefits: string[];
  differentiation: string;
  monthly_price?: number;
  target_audience: string;
  channel: string;
  tone: 'formal' | 'informal' | 'emocional' | 'técnico' | 'divertido';
  call_to_action: string;
  visual_elements?: string[];
  technical_specs?: Record<string, string>;
  created_at: Date;
  updated_at: Date;
}

export interface SegmentReaction {
  archetype: string;
  overall_sentiment: 'muy_positivo' | 'positivo' | 'neutral' | 'negativo' | 'muy_negativo';
  overall_score: number; // 0-100
  variable_reactions: {
    name: VariableReaction;
    description: VariableReaction;
    benefits: VariableReaction;
    differentiation: VariableReaction;
    price: VariableReaction;
    target_audience: VariableReaction;
    channel: VariableReaction;
    tone: VariableReaction;
    call_to_action: VariableReaction;
  };
  key_insights: string[];
  concerns: string[];
  suggestions: string[];
  likelihood_to_adopt: number; // 0-100
  likelihood_to_recommend: number; // 0-100
  persona_context: {
    name: string;
    age: number;
    city: string;
    occupation: string;
  };
}

export interface VariableReaction {
  sentiment: 'muy_positivo' | 'positivo' | 'neutral' | 'negativo' | 'muy_negativo';
  score: number; // 0-100
  reaction_text: string;
  specific_feedback: string;
  improvement_suggestion?: string;
}

export interface EvaluationSession {
  id: string;
  concept: CampaignConcept;
  selected_archetypes: string[];
  reactions: SegmentReaction[];
  summary: {
    average_score: number;
    best_performing_variable: string;
    worst_performing_variable: string;
    top_concerns: string[];
    top_suggestions: string[];
  };
  created_at: Date;
  status: 'draft' | 'evaluating' | 'completed';
}

// Plantillas de conceptos comunes
export const CONCEPT_TEMPLATES = {
  product_concept: {
    name: '',
    description: '',
    benefits: ['', '', ''] as string[],
    differentiation: '',
    monthly_price: 0,
    target_audience: '',
    channel: 'digital',
    tone: 'informal' as const,
    call_to_action: '',
    technical_specs: {}
  },
  campaign: {
    name: '',
    description: '',
    benefits: ['', '', ''] as string[],
    differentiation: '',
    target_audience: '',
    channel: 'redes sociales',
    tone: 'emocional' as const,
    call_to_action: '',
    visual_elements: [] as string[]
  }
};

// Variables de evaluación con sus descripciones
export const EVALUATION_VARIABLES = {
  name: {
    label: 'Nombre',
    description: 'Qué piensa sobre el nombre del producto/campaña',
    weight: 0.15
  },
  description: {
    label: 'Descripción',
    description: 'Claridad y atractivo de la descripción principal',
    weight: 0.20
  },
  benefits: {
    label: 'Beneficios',
    description: 'Relevancia y credibilidad de los beneficios ofrecidos',
    weight: 0.20
  },
  differentiation: {
    label: 'Diferenciación',
    description: 'Qué tan único y diferente percibe la propuesta',
    weight: 0.15
  },
  price: {
    label: 'Precio',
    description: 'Percepción del precio vs valor ofrecido',
    weight: 0.10
  },
  target_audience: {
    label: 'Público Objetivo',
    description: 'Si se siente identificado con el target',
    weight: 0.05
  },
  channel: {
    label: 'Canal',
    description: 'Adecuación del canal de comunicación',
    weight: 0.05
  },
  tone: {
    label: 'Tono',
    description: 'Si el tono de comunicación le resulta apropiado',
    weight: 0.05
  },
  call_to_action: {
    label: 'Call to Action',
    description: 'Efectividad del llamado a la acción',
    weight: 0.05
  }
} as const;

export type EvaluationVariable = keyof typeof EVALUATION_VARIABLES;