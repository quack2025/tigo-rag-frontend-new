// data/hondurasKnowledgeBase.ts - Base de conocimiento cultural hondureña basada en investigación real de Tigo

export interface EconomicContext {
  nse_level: string;
  monthly_income_range: [number, number]; // En lempiras
  telecom_budget_percentage: number;
  typical_telecom_spend: [number, number]; // En lempiras
  payment_preference: 'prepago' | 'postpago' | 'mixed';
  price_sensitivity: 'very_high' | 'high' | 'medium' | 'low';
}

export interface LanguagePatterns {
  formal_expressions: string[];
  informal_expressions: string[];
  price_related: string[];
  quality_related: string[];
  technology_related: string[];
  decision_expressions: string[];
  skepticism_expressions: string[];
  excitement_expressions: string[];
}

export interface RegionalContext {
  city: string;
  department: string;
  urban_level: 'metropolitana' | 'urbana' | 'intermedia' | 'rural';
  economic_profile: string;
  cultural_characteristics: string[];
  competitive_landscape: string[];
}

// Base de conocimiento económico real basado en RAG
export const ECONOMIC_SEGMENTS: Record<string, EconomicContext> = {
  'NSE_AB': {
    nse_level: 'AB',
    monthly_income_range: [25000, 50000], // L25k-50k+
    telecom_budget_percentage: 4,
    typical_telecom_spend: [1000, 2000],
    payment_preference: 'postpago',
    price_sensitivity: 'low'
  },
  'NSE_C_PLUS': {
    nse_level: 'C+',
    monthly_income_range: [15000, 25000], // L15k-25k
    telecom_budget_percentage: 5,
    typical_telecom_spend: [750, 1250],
    payment_preference: 'postpago',
    price_sensitivity: 'medium'
  },
  'NSE_C': {
    nse_level: 'C',
    monthly_income_range: [10000, 15000], // L10k-15k
    telecom_budget_percentage: 4,
    typical_telecom_spend: [400, 600],
    payment_preference: 'mixed',
    price_sensitivity: 'medium'
  },
  'NSE_C_MINUS': {
    nse_level: 'C-',
    monthly_income_range: [7000, 10000], // L7k-10k
    telecom_budget_percentage: 3,
    typical_telecom_spend: [210, 300],
    payment_preference: 'prepago',
    price_sensitivity: 'high'
  },
  'NSE_D': {
    nse_level: 'D',
    monthly_income_range: [5000, 7000], // L5k-7k
    telecom_budget_percentage: 3,
    typical_telecom_spend: [150, 210],
    payment_preference: 'prepago',
    price_sensitivity: 'very_high'
  }
};

// Patrones de lenguaje auténticos por arquetipo (basado en estudios reales)
export const LANGUAGE_PATTERNS: Record<string, LanguagePatterns> = {
  PROFESIONAL: {
    formal_expressions: [
      'Está cabal', 'Vaya pues', 'Me parece que', 'En mi experiencia', 
      'Para ser honesto', 'Lo que veo es que', 'Desde mi perspectiva'
    ],
    informal_expressions: [
      'Órale', 'Está súper', 'Me conviene', 'Está bueno', 'Cabal'
    ],
    price_related: [
      'Se justifica la inversión', 'El ROI es importante', 'Vale la pena el costo',
      'Es una inversión en eficiencia', 'El precio debe justificar el valor'
    ],
    quality_related: [
      'La calidad es fundamental', 'Necesito confiabilidad', 'La estabilidad es clave',
      'No puedo permitirme interrupciones', 'Busco un servicio profesional'
    ],
    technology_related: [
      'Para mi trabajo necesito', 'En presentaciones con clientes', 'En videollamadas importantes',
      'Para gestionar mi equipo', 'Con herramientas de trabajo'
    ],
    decision_expressions: [
      'Necesito evaluarlo bien', 'Déjeme analizarlo', 'Voy a considerarlo', 
      'Necesito probarlo primero', '¿Puedo ver números específicos?'
    ],
    skepticism_expressions: [
      '¿Realmente funciona como dicen?', 'He tenido malas experiencias antes',
      '¿Qué garantías me dan?', 'Necesito ver resultados comprobados'
    ],
    excitement_expressions: [
      'Esto sí me interesa', 'Suena prometedor', 'Podría ser justo lo que necesito',
      'Me gusta la propuesta', 'Veo potencial aquí'
    ]
  },
  
  CONTROLADOR: {
    formal_expressions: [
      'Mire', 'Fíjese que', 'Lo que pasa es que', 'Yo siempre', 'La cosa es que'
    ],
    informal_expressions: [
      '¡Puchica!', 'Órale', 'No me diga', 'Eso sí está bueno', '¡Qué bárbaro!'
    ],
    price_related: [
      'Está muy caro', '¿Y costos ocultos?', 'Tengo que ver mi presupuesto',
      'Con mi sueldo de [X] lempiras', 'Eso son [X] lempiras al año',
      'Prefiero algo más económico'
    ],
    quality_related: [
      'Necesito que funcione bien', 'No me gusta que me fallen',
      'Quiero algo confiable', 'Que valga la pena', 'Servicio de calidad'
    ],
    technology_related: [
      'Para toda la familia', 'Los muchachos también usan', 'En la casa necesitamos',
      'Para controlar el gasto', 'Que alcance para todos'
    ],
    decision_expressions: [
      'Tengo que pensarlo bien', 'Voy a comparar precios', 'Déjeme consultarlo',
      'Necesito ver todas las opciones', 'Voy a preguntarle a mi familia'
    ],
    skepticism_expressions: [
      'Esas promociones siempre tienen letra chiquita', 'Ya me han estafado antes',
      '¿Eso incluye todo?', '¿No hay sorpresas después?', '¿Y si no me gusta?'
    ],
    excitement_expressions: [
      '¡Eso sí está bueno!', 'Ahora sí me convence', '¡Qué oferta!',
      'Eso sí me sirve', '¡Puchica, está cabal!'
    ]
  },

  EMPRENDEDOR: {
    formal_expressions: [
      'En mi negocio', 'Para mis clientes', 'Como empresario', 'En el taller',
      'Con mis trabajadores'
    ],
    informal_expressions: [
      '¡Órale!', 'Está cabal', 'Me conviene', 'Súper', 'Perfecto'
    ],
    price_related: [
      'Si me genera más ventas', 'Es una inversión en el negocio',
      '¿Me va a dar retorno?', 'Con tal que me ayude a vender más',
      'El negocio tiene que justificarlo'
    ],
    quality_related: [
      'Necesito algo confiable', 'No puedo quedarme sin comunicación',
      'Mis clientes necesitan contactarme', 'Para atender bien'
    ],
    technology_related: [
      'Para WhatsApp Business', 'Para recibir pedidos', 'Para coordinar entregas',
      'Para promocionar en redes', 'Para pagos móviles'
    ],
    decision_expressions: [
      'Si me ayuda con el negocio', 'Mientras me genere más clientes',
      'Voy a probarlo en el negocio', 'Si veo resultados, sí'
    ],
    skepticism_expressions: [
      '¿Realmente me va a ayudar a vender?', 'Otros servicios prometen mucho',
      '¿Los clientes lo van a usar?', 'No quiero complicarme'
    ],
    excitement_expressions: [
      '¡Esto sí me sirve para el negocio!', '¡Con esto voy a vender más!',
      '¡Órale, eso está buenísimo!', 'Esto puede cambiar mi negocio'
    ]
  },

  GOMOSO_EXPLORADOR: {
    formal_expressions: [
      'En mis redes sociales', 'Para mi trabajo creativo', 'Como diseñadora',
      'En mi contenido', 'Para mis proyectos'
    ],
    informal_expressions: [
      '¡Qué tuanis!', '¡Súper cabal!', '¡Está increíble!', '¡Genial!', 
      '¡Wow!', '¡Perfecto!', 'Es lo máximo'
    ],
    price_related: [
      'Vale la pena por la experiencia', 'Por algo bueno sí pago',
      'Si está cool, me da igual el precio', 'Para algo premium sí invierto'
    ],
    quality_related: [
      'Tiene que ser de calidad', 'Necesito lo mejor', 'No acepto menos',
      'La experiencia tiene que ser wow', 'Todo tiene que funcionar perfecto'
    ],
    technology_related: [
      'Para mis stories', 'Para subir contenido', 'Para hacer lives',
      'Para gaming', 'Para streaming', 'Para TikTok', 'Para Instagram'
    ],
    decision_expressions: [
      '¡Lo quiero ya!', 'Suena increíble', 'Definitivamente lo voy a probar',
      'Necesito tenerlo', 'Es justo lo que buscaba'
    ],
    skepticism_expressions: [
      '¿Realmente es tan bueno?', 'Espero que no sea pura publicidad',
      '¿Va a funcionar como en otros países?', 'A ver si no decepciona'
    ],
    excitement_expressions: [
      '¡Esto está de otro nivel!', '¡Súper tuanis!', '¡Lo necesito en mi vida!',
      '¡Van a morir de envidia!', '¡Esto va a estar épico!'
    ]
  },

  PRAGMATICO: {
    formal_expressions: [
      'Yo busco algo', 'Lo que necesito es', 'Para mí es importante',
      'Sencillamente', 'Lo básico que necesito'
    ],
    informal_expressions: [
      'Está bien', 'Me sirve', 'Está cabal', 'No está mal', 'Suficiente'
    ],
    price_related: [
      'A buen precio', 'Sin gastar más', 'Lo más económico',
      'Que esté en mi presupuesto', 'Barato y bueno'
    ],
    quality_related: [
      'Que funcione bien', 'Nada complicado', 'Simple y efectivo',
      'Sin problemas', 'Que sea confiable'
    ],
    technology_related: [
      'Para lo básico', 'WhatsApp y llamadas', 'Nada muy complicado',
      'Lo esencial', 'Sin tantas funciones raras'
    ],
    decision_expressions: [
      'Si me sirve, sí', 'Mientras funcione bien', 'Con tal que sea barato',
      'Si no es complicado', 'Voy a probarlo'
    ],
    skepticism_expressions: [
      '¿No será muy complicado?', '¿Realmente es necesario?',
      'Lo que tengo ya me funciona', '¿Vale la pena cambiarse?'
    ],
    excitement_expressions: [
      'Eso sí está bueno', 'Me conviene', 'Está bien para mí',
      'Es lo que necesito', 'Perfecto'
    ]
  },

  RESIGNADO: {
    formal_expressions: [
      'Con el favor de Dios', 'Gracias a Dios', 'Si Dios quiere',
      'Con la ayuda de Dios', 'Como Dios mande'
    ],
    informal_expressions: [
      'Ahí vamos', 'Poco a poco', 'A ver qué pasa', 'Como se pueda',
      'Lo que Dios quiera'
    ],
    price_related: [
      'Está muy caro para mí', 'No me alcanza', 'Con lo poco que gano',
      'Mi pensión no da para más', 'Ojalá fuera más barato'
    ],
    quality_related: [
      'Mientras funcione', 'No pido mucho', 'Con lo básico está bien',
      'Que no me falle', 'Simple y que sirva'
    ],
    technology_related: [
      'Los muchachos me ayudan', 'No entiendo mucho de eso',
      'Para lo básico nomás', 'Los nietos me enseñan'
    ],
    decision_expressions: [
      'Voy a preguntarle a mi hijo', 'Mi familia me aconseja',
      'A ver si me alcanza', 'Dios dirá', 'Como se pueda'
    ],
    skepticism_expressions: [
      'No sé si me sirva', 'Esas cosas son complicadas',
      'Ya estoy viejo para cambios', '¿No será muy caro mantenerlo?'
    ],
    excitement_expressions: [
      'Ojalá me sirva', 'Si es cierto, qué bueno', 'Gracias a Dios',
      'Puede que me ayude', 'Con el favor de Dios'
    ]
  }
};

// Contexto regional basado en datos reales de RAG
export const REGIONAL_CONTEXTS: Record<string, RegionalContext> = {
  TEGUCIGALPA: {
    city: 'Tegucigalpa',
    department: 'Francisco Morazán',
    urban_level: 'metropolitana',
    economic_profile: 'Centro político-administrativo, servicios, NSE más alto',
    cultural_characteristics: [
      'Más cosmopolita', 'Mayor adopción tecnológica', 'Usuarios sofisticados',
      'Comportamiento metropolitano', 'Mayores ingresos promedio'
    ],
    competitive_landscape: [
      'Competencia intensa Tigo vs Claro', 'Mayor penetración postpago',
      'Usuarios más exigentes', 'Adopción temprana de servicios premium'
    ]
  },
  SAN_PEDRO_SULA: {
    city: 'San Pedro Sula',
    department: 'Cortés',
    urban_level: 'metropolitana',
    economic_profile: 'Centro industrial y comercial, emprendimiento',
    cultural_characteristics: [
      'Perfil comercial', 'Orientado a negocios', 'Emprendedor',
      'Balance tradición-modernidad', 'Foco en productividad'
    ],
    competitive_landscape: [
      'Balance prepago-postpago', 'Servicios empresariales importantes',
      'Cobertura factor clave', 'Competencia por segmento comercial'
    ]
  },
  CHOLOMA: {
    city: 'Choloma',
    department: 'Cortés',
    urban_level: 'urbana',
    economic_profile: 'Industrial, maquila, clase trabajadora',
    cultural_characteristics: [
      'Trabajadores de maquila', 'Ingresos regulares', 'Pragmáticos',
      'Enfoque familiar', 'Ahorradores'
    ],
    competitive_landscape: [
      'Predominio prepago', 'Sensibilidad alta al precio',
      'Promociones importantes', 'Cobertura en zonas industriales'
    ]
  },
  LA_CEIBA: {
    city: 'La Ceiba',
    department: 'Atlántida',
    urban_level: 'urbana',
    economic_profile: 'Turismo, comercio, puerto',
    cultural_characteristics: [
      'Orientado al turismo', 'Más relajado', 'Comerciantes',
      'Conexión con exterior', 'Diversidad económica'
    ],
    competitive_landscape: [
      'Cobertura crucial por geografía', 'Mix de segmentos',
      'Turismo requiere calidad', 'Comercio necesita estabilidad'
    ]
  },
  RURAL: {
    city: 'Zonas Rurales',
    department: 'Interior',
    urban_level: 'rural',
    economic_profile: 'Agricultura, ganadería, remesas',
    cultural_characteristics: [
      'Tradiciones fuertes', 'Familia extendida', 'Religioso',
      'Resistente al cambio', 'Comunidad importante'
    ],
    competitive_landscape: [
      'Cobertura determinante', 'Precio muy importante',
      'Prepago dominante', 'Confianza en marca crucial'
    ]
  }
};

// Datos competitivos reales basados en RAG
export const COMPETITIVE_LANDSCAPE = {
  TIGO: {
    strengths: [
      'La mejor señal de Honduras (posicionamiento exitoso)',
      'Mayor cobertura nacional',
      'Innovación en servicios digitales',
      'Recordación publicitaria superior (74% vs 62% Claro)',
      'Liderazgo en postpago'
    ],
    weaknesses: [
      'Percepción de precios altos en prepago',
      'Competencia intensa en NSE C-/D'
    ]
  },
  CLARO: {
    strengths: [
      'Precios competitivos en prepago',
      'Ofertas de smartphones atractivas',
      'Buena presencia urbana'
    ],
    weaknesses: [
      'Problemas de cobertura rural',
      'Menor innovación en servicios digitales'
    ]
  }
};

// Patrones de consumo digital reales basado en estudios
export const DIGITAL_BEHAVIOR = {
  SOCIAL_MEDIA_USAGE: {
    'Facebook': { penetration: 80, primary_age: '20-45', usage_type: 'universal' },
    'YouTube': { penetration: 65, primary_age: '15-35', usage_type: 'entertainment' },
    'Instagram': { penetration: 52, primary_age: '18-30', usage_type: 'visual_social' },
    'TikTok': { penetration: 48, primary_age: '15-25', usage_type: 'video_viral' },
    'WhatsApp': { penetration: 95, primary_age: 'all', usage_type: 'communication' }
  },
  GAMING: {
    penetration: 84,
    primary_games: ['Free Fire', 'Clash Royale', 'Candy Crush'],
    data_consumption: 'high',
    age_group: '20-35'
  },
  STREAMING: {
    penetration: 45,
    services: ['YouTube', 'Netflix (limitado)', 'TV nacional online'],
    quality_sensitivity: 'high'
  }
};

export default {
  ECONOMIC_SEGMENTS,
  LANGUAGE_PATTERNS,
  REGIONAL_CONTEXTS,
  COMPETITIVE_LANDSCAPE,
  DIGITAL_BEHAVIOR
};