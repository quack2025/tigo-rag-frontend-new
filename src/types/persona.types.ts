// types/persona.types.ts - Definición completa del sistema de personas sintéticas

// Los 6 Arquetipos de Tigo Honduras
export const TigoArchetype = {
  PROFESIONAL: 'PROFESIONAL',
  CONTROLADOR: 'CONTROLADOR',
  EMPRENDEDOR: 'EMPRENDEDOR',
  GOMOSO_EXPLORADOR: 'GOMOSO_EXPLORADOR',
  PRAGMATICO: 'PRAGMATICO',
  RESIGNADO: 'RESIGNADO'
} as const;

export type TigoArchetype = typeof TigoArchetype[keyof typeof TigoArchetype];

// Sistema de 80 Características Configurables
export interface PersonaCharacteristics {
  // Demographics (15)
  demographics: {
    age: number;
    gender: 'male' | 'female' | 'other';
    income_bracket: 'A/B' | 'C+' | 'C' | 'C-' | 'D' | 'E';
    education_level: 'primary' | 'secondary' | 'technical' | 'university' | 'postgraduate';
    employment_status: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
    household_size: number;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed' | 'cohabiting';
    children_count: number;
    location_type: 'urban' | 'suburban' | 'rural';
    housing_type: 'owned' | 'rented' | 'family' | 'other';
    vehicle_ownership: 'none' | 'motorcycle' | 'car' | 'multiple';
    language_primary: 'spanish' | 'english' | 'garifuna' | 'miskito';
    language_secondary: string;
    disability_status: 'none' | 'physical' | 'visual' | 'hearing' | 'cognitive';
    migration_status: 'native' | 'internal_migrant' | 'international_migrant' | 'returnee';
  };

  // Psychographics (20) - Big Five + Values
  psychographics: {
    personality_openness: number; // 0-100
    personality_conscientiousness: number;
    personality_extraversion: number;
    personality_agreeableness: number;
    personality_neuroticism: number;
    risk_tolerance: number;
    innovation_adoption: 'innovator' | 'early_adopter' | 'early_majority' | 'late_majority' | 'laggard';
    brand_loyalty: number;
    price_sensitivity: number;
    convenience_preference: number;
    social_influence_susceptibility: number;
    decision_making_style: 'rational' | 'intuitive' | 'dependent' | 'avoidant' | 'spontaneous';
    time_orientation: 'past' | 'present' | 'future';
    achievement_orientation: number;
    security_values: number;
    hedonism_values: number;
    tradition_values: number;
    benevolence_values: number;
    power_values: number;
    self_direction_values: number;
  };

  // FMCG-Specific (25)
  fmcg: {
    monthly_fmcg_spend: number; // in pesos
    shopping_frequency: 'daily' | 'few_times_week' | 'weekly' | 'biweekly' | 'monthly';
    primary_shopping_channel: 'supermarket' | 'convenience_store' | 'traditional_market' | 'online' | 'warehouse_club';
    secondary_shopping_channels: string[];
    brand_loyalty_level: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    price_sensitivity: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    promotion_responsiveness: number; // 0-100
    bulk_buying_behavior: 'never' | 'sometimes' | 'often' | 'always';
    private_label_acceptance: 'never' | 'some_categories' | 'many_categories' | 'all_categories';
    organic_natural_preference: number; // 0-100
    health_consciousness: number; // 0-100
    convenience_importance: number; // 0-100
    packaging_influence: number; // 0-100
    social_media_influence: number; // 0-100
    influencer_trust_level: number; // 0-100
    innovation_adoption: 'laggard' | 'late_majority' | 'early_majority' | 'early_adopter' | 'innovator';
    eco_sustainability_concern: number; // 0-100
    local_brand_preference: number; // 0-100
    quality_vs_price_priority: 'price_first' | 'balanced' | 'quality_first';
    shopping_planning_style: 'impulse' | 'mixed' | 'planned';
    family_decision_influence: 'individual' | 'spouse_shared' | 'family_consensus' | 'others_decide';
    category_expertise: string[]; // categories they know well
    payment_preference: 'cash' | 'debit_card' | 'credit_card' | 'digital_wallet' | 'mixed';
    online_grocery_adoption: 'never' | 'tried_once' | 'occasional' | 'regular' | 'primary';
    stockpiling_tendency: number; // 0-100
  };

  // Honduras Sociocultural (15)
  sociocultural: {
    cultural_identity_strength: number; // 0-100
    family_influence_level: number;
    community_involvement: 'none' | 'low' | 'medium' | 'high' | 'leader';
    social_media_platform_preference: string[];
    entertainment_content_preference: string[];
    shopping_channel_preference: 'traditional' | 'online' | 'mixed';
    technology_comfort_level: number; // 0-100
    environmental_consciousness: number;
    social_status_importance: number;
    regional_pride: number;
    urban_rural_preference: 'strongly_urban' | 'urban' | 'neutral' | 'rural' | 'strongly_rural';
    remittances_dependency: 'none' | 'low' | 'medium' | 'high';
    informal_economy_participation: number; // 0-100
    social_mobility_aspiration: number;
    collective_vs_individual_orientation: number; // 0=individual, 100=collective
  };

  // Economic Context (5)
  economic: {
    economic_optimism: number; // 0-100
    inflation_impact_perception: 'none' | 'low' | 'medium' | 'high' | 'severe';
    savings_behavior: 'none' | 'informal' | 'formal' | 'mixed';
    credit_usage: 'none' | 'informal' | 'formal' | 'both';
    informal_income_percentage: number; // 0-100
  };
}

// Perfil completo de Persona
export interface SyntheticPersona {
  // Identificación
  id: string;
  archetype: TigoArchetype;
  variant_id: string; // Para A/B testing
  
  // Información básica
  name: string;
  photo_url?: string;
  location: {
    city: string;
    department: string;
    neighborhood?: string;
  };
  
  // Características completas (80)
  characteristics: PersonaCharacteristics;
  
  // Contexto narrativo
  background: {
    life_story: string;
    daily_routine: string;
    pain_points: string[];
    aspirations: string[];
    social_circle: string;
    media_consumption: string[];
    brand_relationships: Record<string, string>;
  };
  
  // Estado emocional y contexto temporal
  temporal_state: {
    current_mood: 'happy' | 'neutral' | 'frustrated' | 'anxious' | 'excited';
    recent_events: string[];
    seasonal_context: string;
    economic_situation: string;
  };
  
  // Configuración de conversación
  conversation_style: {
    formality_level: 'very_formal' | 'formal' | 'neutral' | 'informal' | 'very_informal';
    verbosity: 'concise' | 'normal' | 'verbose';
    dialect_markers: string[]; // Hondureñismos específicos
    emotional_expression: 'reserved' | 'moderate' | 'expressive';
  };
  
  // Validación y ética
  validation: {
    is_counter_stereotypical: boolean;
    diversity_score: number;
    authenticity_score: number;
    last_validated: Date;
    validation_notes: string[];
  };
  
  // Metadata
  metadata: {
    created_at: Date;
    updated_at: Date;
    created_by: string;
    version: number;
    research_project?: string;
    tags: string[];
  };
}

// Configuración para generación de personas
export interface PersonaGenerationConfig {
  archetype: TigoArchetype;
  count: number;
  diversity_requirements: {
    gender_distribution: Record<string, number>;
    age_distribution: Record<string, number>;
    location_distribution: Record<string, number>;
    nse_distribution: Record<string, number>;
  };
  counter_stereotypical_percentage: number; // Minimum 30%
  include_edge_cases: boolean;
  temporal_context: {
    current_events: string[];
    season: string;
    economic_climate: string;
  };
}

// Plantillas base de arquetipos
export const ARCHETYPE_TEMPLATES: Record<TigoArchetype, Partial<PersonaCharacteristics>> = {
  [TigoArchetype.PROFESIONAL]: {
    demographics: {
      age: 38,
      gender: 'male',
      income_bracket: 'B',
      education_level: 'university',
      employment_status: 'employed',
      location_type: 'urban',
      housing_type: 'owned',
      vehicle_ownership: 'car',
    } as any,
    psychographics: {
      personality_conscientiousness: 85,
      innovation_adoption: 'early_adopter',
      achievement_orientation: 90,
      time_orientation: 'future',
    } as any,
    fmcg: {
      monthly_fmcg_spend: 25000,
      shopping_frequency: 'weekly',
      primary_shopping_channel: 'supermarket',
      brand_loyalty_level: 'high',
      price_sensitivity: 'medium',
      innovation_adoption: 'early_adopter',
      quality_vs_price_priority: 'quality_first',
    } as any,
  },
  
  [TigoArchetype.CONTROLADOR]: {
    demographics: {
      age: 42,
      gender: 'female',
      income_bracket: 'C+',
      education_level: 'secondary',
      employment_status: 'self-employed',
      marital_status: 'married',
      children_count: 2,
    } as any,
    psychographics: {
      personality_conscientiousness: 90,
      risk_tolerance: 30,
      security_values: 85,
      tradition_values: 75,
    } as any,
    fmcg: {
      monthly_fmcg_spend: 18000,
      shopping_frequency: 'weekly',
      primary_shopping_channel: 'supermarket',
      brand_loyalty_level: 'very_high',
      price_sensitivity: 'high',
      shopping_planning_style: 'planned',
      quality_vs_price_priority: 'balanced',
    } as any,
  },
  
  [TigoArchetype.EMPRENDEDOR]: {
    demographics: {
      age: 32,
      gender: 'male',
      income_bracket: 'C',
      education_level: 'technical',
      employment_status: 'self-employed',
      location_type: 'suburban',
    } as any,
    psychographics: {
      risk_tolerance: 75,
      achievement_orientation: 85,
      self_direction_values: 80,
      innovation_adoption: 'early_majority',
    } as any,
    fmcg: {
      monthly_fmcg_spend: 15000,
      shopping_frequency: 'biweekly',
      primary_shopping_channel: 'convenience_store',
      brand_loyalty_level: 'medium',
      price_sensitivity: 'medium',
      innovation_adoption: 'early_majority',
      shopping_planning_style: 'mixed',
    } as any,
  },
  
  [TigoArchetype.GOMOSO_EXPLORADOR]: {
    demographics: {
      age: 26,
      gender: 'female',
      income_bracket: 'C+',
      education_level: 'university',
      employment_status: 'employed',
      marital_status: 'single',
    } as any,
    psychographics: {
      personality_openness: 85,
      personality_extraversion: 80,
      hedonism_values: 75,
      innovation_adoption: 'innovator',
    } as any,
    fmcg: {
      plan_type: 'postpaid',
      data_usage_gb: 30,
      streaming_habits: ['Netflix', 'Spotify', 'TikTok', 'Instagram'],
      gaming_mobile_usage: 'regular',
    } as any,
  },
  
  [TigoArchetype.PRAGMATICO]: {
    demographics: {
      age: 35,
      gender: 'male',
      income_bracket: 'C',
      education_level: 'technical',
      employment_status: 'employed',
    } as any,
    psychographics: {
      price_sensitivity: 80,
      convenience_preference: 75,
      decision_making_style: 'rational',
    } as any,
    fmcg: {
      plan_type: 'prepaid',
      monthly_spend: 400,
      wifi_dependency: 70,
    } as any,
  },
  
  [TigoArchetype.RESIGNADO]: {
    demographics: {
      age: 48,
      gender: 'male',
      income_bracket: 'D',
      education_level: 'primary',
      employment_status: 'self-employed',
      location_type: 'rural',
    } as any,
    psychographics: {
      risk_tolerance: 20,
      tradition_values: 85,
      innovation_adoption: 'laggard',
    } as any,
    fmcg: {
      plan_type: 'prepaid',
      monthly_spend: 200,
      device_age: 36,
      switching_consideration: 10,
    } as any,
  },
};

// Validación de sesgo
export interface BiasValidation {
  persona_id: string;
  checks_passed: {
    gender_diversity: boolean;
    age_diversity: boolean;
    geographic_diversity: boolean;
    economic_diversity: boolean;
    counter_stereotypical: boolean;
  };
  diversity_score: number;
  recommendations: string[];
  requires_human_review: boolean;
}