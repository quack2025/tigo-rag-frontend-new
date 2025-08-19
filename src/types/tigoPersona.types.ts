// types/tigoPersona.types.ts - Tipos simplificados específicos para TIGO Honduras

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

// Demografía simplificada para TIGO
export interface TigoDemographics {
  age: number;
  gender: 'male' | 'female' | 'other';
  nse: 'A' | 'B' | 'C+' | 'C' | 'C-' | 'D';
  monthly_income: number;
  education_level: string;
  occupation: string;
  family_status: string;
  current_telecom_spend: number;
}

// Ubicación en Honduras
export interface TigoLocation {
  city: string;
  neighborhood?: string;
  region: string;
}

// Psicografía para telecom
export interface TigoPsychographics {
  lifestyle: string;
  values: string[];
  motivations: string[];
  main_concerns: string[];
  price_sensitivity: string;
  tech_adoption: string;
  preferred_channels: string[];
}

// Características completas de persona TIGO
export interface TigoCharacteristics {
  demographics: TigoDemographics;
  location: TigoLocation;
  psychographics: TigoPsychographics;
}

// Persona sintética simplificada para TIGO
export interface SyntheticPersona {
  id: string;
  name: string;
  archetype: TigoArchetype;
  characteristics: TigoCharacteristics;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  is_active: boolean;
}

// Plantillas simplificadas de arquetipos TIGO
export const ARCHETYPE_TEMPLATES: Record<TigoArchetype, Partial<SyntheticPersona>> = {
  [TigoArchetype.PROFESIONAL]: {
    characteristics: {
      demographics: {
        age: 35,
        gender: 'male',
        nse: 'B',
        monthly_income: 25000,
        education_level: 'Universidad',
        occupation: 'Gerente',
        family_status: 'Casado',
        current_telecom_spend: 1200
      },
      location: {
        city: 'Tegucigalpa',
        region: 'Región Central'
      },
      psychographics: {
        lifestyle: 'Profesional ocupado',
        values: ['Eficiencia', 'Calidad', 'Trabajo'],
        motivations: ['Productividad', 'Crecimiento profesional'],
        main_concerns: ['Cobertura', 'Velocidad'],
        price_sensitivity: 'Media',
        tech_adoption: 'Avanzado',
        preferred_channels: ['App Mi Tigo', 'Call center']
      }
    }
  },

  [TigoArchetype.CONTROLADOR]: {
    characteristics: {
      demographics: {
        age: 42,
        gender: 'female',
        nse: 'C+',
        monthly_income: 18000,
        education_level: 'Secundaria',
        occupation: 'Ama de casa',
        family_status: 'Casada con hijos',
        current_telecom_spend: 800
      },
      location: {
        city: 'San Pedro Sula',
        region: 'Región Norte'
      },
      psychographics: {
        lifestyle: 'Centrada en la familia',
        values: ['Familia', 'Seguridad', 'Control'],
        motivations: ['Proteger a la familia', 'Ahorrar dinero'],
        main_concerns: ['Costo', 'Control parental'],
        price_sensitivity: 'Muy alta',
        tech_adoption: 'Básico',
        preferred_channels: ['Punto de venta', 'Call center']
      }
    }
  },

  [TigoArchetype.EMPRENDEDOR]: {
    characteristics: {
      demographics: {
        age: 32,
        gender: 'male',
        nse: 'C',
        monthly_income: 15000,
        education_level: 'Técnico',
        occupation: 'Comerciante',
        family_status: 'Soltero',
        current_telecom_spend: 600
      },
      location: {
        city: 'Choloma',
        region: 'Región Norte'
      },
      psychographics: {
        lifestyle: 'Emprendedor activo',
        values: ['Crecimiento', 'Oportunidad', 'Flexibilidad'],
        motivations: ['Hacer crecer el negocio', 'Más clientes'],
        main_concerns: ['Conectividad para negocio', 'ROI'],
        price_sensitivity: 'Alta',
        tech_adoption: 'Intermedio',
        preferred_channels: ['WhatsApp Business', 'Agentes autorizados']
      }
    }
  },

  [TigoArchetype.GOMOSO_EXPLORADOR]: {
    characteristics: {
      demographics: {
        age: 26,
        gender: 'female',
        nse: 'B',
        monthly_income: 20000,
        education_level: 'Universidad',
        occupation: 'Diseñadora',
        family_status: 'Soltera',
        current_telecom_spend: 1000
      },
      location: {
        city: 'La Ceiba',
        region: 'Región Costa Norte'
      },
      psychographics: {
        lifestyle: 'Social y digital',
        values: ['Innovación', 'Tendencias', 'Estética'],
        motivations: ['Estar a la moda', 'Compartir experiencias'],
        main_concerns: ['Velocidad de datos', 'Funciones nuevas'],
        price_sensitivity: 'Media',
        tech_adoption: 'Muy avanzado',
        preferred_channels: ['App Mi Tigo', 'Redes sociales']
      }
    }
  },

  [TigoArchetype.PRAGMATICO]: {
    characteristics: {
      demographics: {
        age: 38,
        gender: 'male',
        nse: 'C',
        monthly_income: 12000,
        education_level: 'Secundaria',
        occupation: 'Empleado',
        family_status: 'Casado',
        current_telecom_spend: 500
      },
      location: {
        city: 'Comayagua',
        region: 'Región Central'
      },
      psychographics: {
        lifestyle: 'Vida sencilla',
        values: ['Practicidad', 'Simplicidad', 'Utilidad'],
        motivations: ['Funcionalidad básica', 'Buen precio'],
        main_concerns: ['Precio', 'Simplicidad'],
        price_sensitivity: 'Muy alta',
        tech_adoption: 'Básico',
        preferred_channels: ['Punto de venta', 'Supermercados']
      }
    }
  },

  [TigoArchetype.RESIGNADO]: {
    characteristics: {
      demographics: {
        age: 55,
        gender: 'male',
        nse: 'C-',
        monthly_income: 8000,
        education_level: 'Primaria',
        occupation: 'Agricultor',
        family_status: 'Casado',
        current_telecom_spend: 300
      },
      location: {
        city: 'Juticalpa',
        region: 'Región Oriental'
      },
      psychographics: {
        lifestyle: 'Tradicional y conservador',
        values: ['Tradición', 'Simplicidad', 'Conformidad'],
        motivations: ['Mantener contacto familiar', 'No complicarse'],
        main_concerns: ['Precio muy bajo', 'Facilidad de uso'],
        price_sensitivity: 'Extrema',
        tech_adoption: 'Limitado',
        preferred_channels: ['Punto de venta', 'Familiares']
      }
    }
  }
};

// Request/Response types para LLM Service
export interface TigoLLMRequest {
  userMessage: string;
  persona: SyntheticPersona;
  productContext?: {
    campaign?: string;
    service?: string;
    telecom_context?: string;
    concept_type?: string;
  };
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export interface TigoLLMResponse {
  response: string;
  persona_insights: {
    archetype_influence: string;
    regional_context: string;
    telecom_relevance: string;
  };
  suggested_follow_ups: string[];
  confidence_score: number;
}