// utils/authenticConversationEngine.ts - Motor de conversación auténtica hondureña

import { 
  ECONOMIC_SEGMENTS, 
  LANGUAGE_PATTERNS
} from '../data/hondurasKnowledgeBase';
import type { CampaignConcept, VariableReaction, EvaluationVariable } from '../types/campaign.types';
import { TigoArchetype } from '../types/persona.types';

interface PersonaProfile {
  archetype: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  nse: string;
  monthly_income: number;
  current_telecom_spend: number;
}

interface ConversationContext {
  variable: EvaluationVariable;
  concept: CampaignConcept;
  persona: PersonaProfile;
  previous_reactions?: VariableReaction[];
}

export class AuthenticConversationEngine {
  
  static generateAuthenticReaction(context: ConversationContext): VariableReaction {
    const { variable, concept, persona } = context;
    
    // Obtener datos contextuales
    const economicData = this.getEconomicContext(persona.nse);
    const languagePatterns = LANGUAGE_PATTERNS[persona.archetype];
    
    // Generar reacción auténtica basada en la variable
    const reaction = this.generateVariableSpecificReaction(variable, concept, persona, economicData, languagePatterns);
    
    return reaction;
  }

  private static getEconomicContext(nse: string) {
    const nseMap: Record<string, string> = {
      'A': 'NSE_AB', 'B': 'NSE_AB', 'C+': 'NSE_C_PLUS',
      'C': 'NSE_C', 'C-': 'NSE_C_MINUS', 'D': 'NSE_D'
    };
    return ECONOMIC_SEGMENTS[nseMap[nse]] || ECONOMIC_SEGMENTS.NSE_C;
  }


  private static generateVariableSpecificReaction(
    variable: EvaluationVariable,
    concept: CampaignConcept,
    persona: PersonaProfile,
    economicData: any,
    languagePatterns: any
  ): VariableReaction {
    
    switch (variable) {
      case 'name':
        return this.generateNameReaction(concept, persona, languagePatterns);
      case 'price':
        return this.generatePriceReaction(concept, persona, economicData, languagePatterns);
      case 'description':
        return this.generateDescriptionReaction(concept, persona, languagePatterns);
      case 'benefits':
        return this.generateBenefitsReaction(concept, persona, languagePatterns);
      case 'differentiation':
        return this.generateDifferentiationReaction(concept, persona, languagePatterns);
      case 'target_audience':
        return this.generateTargetAudienceReaction(concept, persona, languagePatterns);
      case 'channel':
        return this.generateChannelReaction(concept, persona, languagePatterns);
      case 'tone':
        return this.generateToneReaction(concept, persona, languagePatterns);
      case 'call_to_action':
        return this.generateCallToActionReaction(concept, persona, languagePatterns);
      default:
        return this.generateGenericReaction(variable);
    }
  }

  private static generateNameReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    if (archetype === TigoArchetype.PROFESIONAL) {
      const professionalWords = ['pro', 'premium', 'business', 'ejecutivo', 'profesional'];
      const hasMatch = professionalWords.some(word => concept.name.toLowerCase().includes(word));
      
      if (hasMatch) {
        score = 75 + Math.random() * 20;
        sentiment = score > 80 ? 'muy_positivo' : 'positivo';
        reactionText = `"${concept.name}" suena profesional y confiable. ${this.getRandomExpression(languagePatterns.formal_expressions)} En mi trabajo necesito que el nombre transmita seriedad, y esto me parece que va por buen camino. Para presentaciones con clientes y videollamadas importantes, el nombre es lo primero que ven.

        Lo que me gusta es que no suena como esos nombres complicados que a veces ponen las empresas. Es directo pero elegante. Claro que al final lo importante es que el servicio funcione, pero para crear esa primera impresión con colegas y clientes, un nombre profesional ayuda mucho.

        ${this.getRandomExpression(languagePatterns.decision_expressions)} ¿Qué garantías me dan de que va a funcionar como lo promocionan? Porque el nombre está bien, pero necesito ver números reales de velocidad y estabilidad.`;
        
        specificFeedback = `El nombre "${concept.name}" conecta bien con el segmento profesional. Transmite seriedad y confiabilidad, aspectos valorados en el entorno corporativo hondureño. La simplicidad del nombre facilita su recordación en contextos de negocios.`;
      } else {
        score = 35 + Math.random() * 30;
        sentiment = score < 40 ? 'negativo' : 'neutral';
        reactionText = `"${concept.name}"... ${this.getRandomExpression(languagePatterns.skepticism_expressions)} No me suena muy profesional que digamos. En mi oficina necesito algo que genere confianza con los clientes, y este nombre no me transmite esa seriedad.

        Mire, cuando hago presentaciones o estoy en videollamadas importantes, el nombre del servicio aparece en pantalla. Necesito que se vea corporativo, no como algo casero. ${this.getRandomExpression(languagePatterns.formal_expressions)} que para el mercado empresarial necesitan algo más serio.

        No es que esté mal, pero para mi segmento creo que necesitan repensar el nombre. ¿No tienen algo que suene más premium o ejecutivo?`;
        
        specificFeedback = `El nombre "${concept.name}" no resuena con las expectativas del segmento profesional. Carece de elementos que transmitan profesionalismo, premium o seriedad empresarial.`;
        
        improvementSuggestion = 'Considerar términos como "Pro", "Business", "Enterprise" o "Premium" que generen mayor credibilidad en el entorno corporativo hondureño.';
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      const familyWords = ['familia', 'hogar', 'control', 'seguro', 'confiable'];
      const hasMatch = familyWords.some(word => concept.name.toLowerCase().includes(word));
      
      if (hasMatch) {
        score = 70 + Math.random() * 25;
        sentiment = score > 80 ? 'muy_positivo' : 'positivo';
        reactionText = `"${concept.name}" me gusta porque suena como algo para la familia. ${this.getRandomExpression(languagePatterns.informal_expressions)} Yo siempre busco servicios que nos sirvan a todos en casa, y este nombre me da esa sensación de que es para nosotros.

        Mire, yo soy la que manejo el presupuesto familiar, entonces necesito que todo esté claro desde el nombre. No me gustan esas cosas complicadas o que suenen como solo para gente rica. Este nombre me parece que está dirigido a familias como la nuestra.

        ${this.getRandomExpression(languagePatterns.decision_expressions)} Pero el nombre está bien, eso sí. Suena confiable y familiar. Ahora lo que necesito saber es si realmente va a funcionar para toda la familia y no me va a traer sorpresas en el precio.`;
        
        specificFeedback = `El nombre "${concept.name}" resuena con los valores familiares del segmento controlador. Transmite confiabilidad y orientación familiar, aspectos clave para la toma de decisiones en este arquetipo.`;
      } else {
        score = 40 + Math.random() * 30;
        sentiment = score < 45 ? 'negativo' : 'neutral';
        reactionText = `"${concept.name}"... no sé, no me convence del todo. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} Suena como muy técnico o muy comercial. Yo busco algo que sea para toda la familia, no algo que suene complicado.

        Fíjese que cuando veo nombres así, me da la impresión de que van a ser caros o van a tener muchas condiciones raras. Yo prefiero cosas más claras, que uno entienda desde el nombre qué es lo que está comprando.

        No digo que esté malo, pero para mí y mi familia necesitamos algo que suene más familiar, más confiable. ¿No tienen algo más sencillo?`;
        
        specificFeedback = `El nombre "${concept.name}" no conecta con las expectativas familiares del segmento controlador. Puede percibirse como demasiado técnico o comercial para su preferencia por simplicidad y orientación familiar.`;
        
        improvementSuggestion = 'Incluir elementos que evoquen familia, hogar, control o confiabilidad para conectar mejor con este segmento tradicionalmente familiar.';
      }
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const coolWords = ['smart', 'pro', 'plus', 'max', 'ultra', '5g', 'digital'];
      const hasMatch = coolWords.some(word => concept.name.toLowerCase().includes(word));
      
      if (hasMatch) {
        score = 80 + Math.random() * 20;
        sentiment = 'muy_positivo';
        reactionText = `¡${this.getRandomExpression(languagePatterns.excitement_expressions)}! "${concept.name}" suena súper cool y moderno. Es exactamente el tipo de nombre que me gusta ver en mis apps y en mis stories. Tiene ese factor wow que busco.

        Como diseñadora, siempre estoy pendiente de las tendencias, y este nombre definitivamente está en la línea de lo que está de moda. Mis amigos van a preguntar qué es cuando lo vean en mi teléfono, y eso me encanta porque me gusta ser la primera en probar cosas nuevas.

        ${this.getRandomExpression(languagePatterns.excitement_expressions)} Para mi contenido en redes sociales, este nombre se va a ver perfecto. Es el tipo de cosa que puedo mencionar en mis posts y va a generar curiosidad. ¡Definitivamente quiero probarlo!`;
        
        specificFeedback = `El nombre "${concept.name}" conecta perfectamente con el segmento joven y trendy. Tiene elementos modernos que generan excitement y social proof, aspectos clave para este arquetipo digital.`;
      } else {
        score = 30 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `"${concept.name}"... mmm, no sé. Suena muy básico, muy común. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} No tiene ese factor cool que busco para mis redes sociales.

        Mire, yo soy diseñadora y siempre estoy buscando cosas que sean diferentes, que destaquen. Este nombre me parece muy genérico, como que cualquier empresa lo podría usar. No me da esa sensación de innovación o modernidad.

        Para subir stories o hacer posts sobre tecnología, necesito algo que suene más trendy, más actual. Este nombre no me inspire a compartirlo con mis seguidores. ¿No tienen algo más creativo o con más personalidad?`;
        
        specificFeedback = `El nombre "${concept.name}" no captura la atención del segmento joven y digital. Carece de elementos de innovación, modernidad o personalidad que son clave para este arquetipo influencer.`;
        
        improvementSuggestion = 'Agregar elementos más trendy, creativos o tecnológicos que generen excitement y sean "instagrameables" para el segmento joven.';
      }
    }

    // Continuar con otros arquetipos...
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText,
      specific_feedback: specificFeedback,
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generatePriceReaction(concept: CampaignConcept, persona: PersonaProfile, economicData: any, languagePatterns: any): VariableReaction {
    if (!concept.monthly_price) {
      return {
        sentiment: 'neutral',
        score: 45,
        reaction_text: 'No veo el precio y eso me preocupa. Prefiero transparencia total desde el inicio.',
        specific_feedback: 'La falta de información de precio genera desconfianza e incertidumbre.',
        improvement_suggestion: 'Mostrar el precio de manera transparente genera más confianza.'
      };
    }

    const { archetype } = persona;
    const price = concept.monthly_price;
    const incomeRange = economicData.monthly_income_range;
    const averageIncome = (incomeRange[0] + incomeRange[1]) / 2;
    const pricePercentage = (price / averageIncome) * 100;
    const currentSpendRange = economicData.typical_telecom_spend;
    const currentSpendAvg = (currentSpendRange[0] + currentSpendRange[1]) / 2;
    const priceIncrease = ((price - currentSpendAvg) / currentSpendAvg) * 100;

    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    if (archetype === TigoArchetype.CONTROLADOR) {
      reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)}, L${price.toLocaleString()} mensuales... déjeme hacer cuentas. Eso son L${(price * 12).toLocaleString()} al año, y con mi ingreso familiar de unos L${averageIncome.toLocaleString()} mensuales, serían como ${pricePercentage.toFixed(1)}% de nuestros ingresos solo en internet.

      Actualmente gasto unos L${currentSpendAvg.toLocaleString()} en Tigo, entonces esto sería un aumento de ${priceIncrease > 0 ? `${priceIncrease.toFixed(0)}%` : 'prácticamente igual'}. ${this.getRandomExpression(languagePatterns.price_related)} Para una familia como la nuestra, cada lempira cuenta.

      ${priceIncrease > 50 ? 
        `${this.getRandomExpression(languagePatterns.skepticism_expressions)} ¿Realmente vale la pena ese aumento? Necesito ver beneficios muy claros que justifiquen gastar tanto más. Con ese dinero extra podría comprar útiles escolares para los muchachos o ahorrar para emergencias.` :
        `El precio no está tan mal, pero necesito estar segura de que voy a obtener el valor completo. ¿Qué garantías me dan? ¿Y si no me gusta, puedo regresar a mi plan actual sin penalidades?`}`;

      if (pricePercentage > 6) {
        score = 25 + Math.random() * 20;
        sentiment = 'negativo';
        specificFeedback = `El precio representa ${pricePercentage.toFixed(1)}% del ingreso familiar, excediendo el presupuesto típico de telecomunicaciones (3-4%) para este segmento.`;
        improvementSuggestion = 'Considerar opciones de financiamiento, descuentos familiares o planes con menor costo inicial para facilitar la adopción.';
      } else if (pricePercentage > 4) {
        score = 45 + Math.random() * 20;
        sentiment = 'neutral';
        specificFeedback = `El precio está en el límite superior del presupuesto familiar típico, requiere justificación clara del valor adicional.`;
        improvementSuggestion = 'Enfatizar beneficios familiares específicos y ofrecer garantías de satisfacción para reducir el riesgo percibido.';
      } else {
        score = 65 + Math.random() * 25;
        sentiment = 'positivo';
        specificFeedback = `El precio está dentro del rango aceptable para el presupuesto familiar, con potencial de adopción si se demuestra valor claro.`;
      }
    }

    // Continuar con otros arquetipos...

    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText,
      specific_feedback: specificFeedback,
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  // Métodos auxiliares
  private static getRandomExpression(expressions: string[]): string {
    return expressions[Math.floor(Math.random() * expressions.length)];
  }

  // Placeholder methods for other variables
  private static generateDescriptionReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    if (archetype === TigoArchetype.PROFESIONAL) {
      const hasBusinessTerms = concept.description && (
        concept.description.toLowerCase().includes('productividad') ||
        concept.description.toLowerCase().includes('eficiencia') ||
        concept.description.toLowerCase().includes('corporativo') ||
        concept.description.toLowerCase().includes('empresa')
      );

      if (hasBusinessTerms) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} La descripción me parece clara y enfocada en lo que necesito profesionalmente. Me gusta que hablen de productividad y eficiencia, porque eso es exactamente lo que busco para mi trabajo.

En mi oficina necesitamos herramientas que realmente nos ayuden a ser más eficientes. ${this.getRandomExpression(languagePatterns.quality_related)} Cuando trabajo desde casa o estoy en videollamadas con clientes internacionales, necesito que todo funcione sin problemas.

${this.getRandomExpression(languagePatterns.decision_expressions)} ¿Tienen casos de éxito con otras empresas similares? Porque la descripción suena bien, pero necesito ver resultados reales antes de tomar una decisión.`;
        
        specificFeedback = 'La descripción conecta bien con las necesidades profesionales del segmento. Enfatiza aspectos de productividad y eficiencia que son valorados en el entorno corporativo.';
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `La descripción está bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no veo cómo esto específicamente me va a ayudar en mi trabajo diario. Necesito que sean más claros sobre los beneficios profesionales.

${this.getRandomExpression(languagePatterns.technology_related)}, entonces necesito entender exactamente cómo esto mejora mi productividad. La descripción es muy general y no me da la confianza que busco.

¿Podrían ser más específicos sobre las ventajas para usuarios corporativos? Porque así como está, no me convence completamente.`;
        
        specificFeedback = 'La descripción carece de elementos específicos para el segmento profesional. No comunica claramente los beneficios de productividad o eficiencia empresarial.';
        improvementSuggestion = 'Incluir términos específicos sobre productividad, eficiencia, herramientas corporativas y beneficios medibles para profesionales.';
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      const hasSimpleLanguage = concept.description && (
        !concept.description.includes('tecnología avanzada') &&
        !concept.description.includes('innovador') &&
        concept.description.length < 200
      );

      if (hasSimpleLanguage) {
        score = 70 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} La descripción me parece entendible y no complicada. Me gusta que no usen palabras raras o técnicas que uno no entiende.

Yo siempre busco que me expliquen las cosas claras, sin tanto rollo. Para mi familia necesitamos algo que sea fácil de usar y que todos podamos entender. ${this.getRandomExpression(languagePatterns.informal_expressions)}

${this.getRandomExpression(languagePatterns.decision_expressions)} Pero necesito estar segura de que realmente es tan simple como lo describen. ¿No hay condiciones raras o cosas que no están mencionando aquí?`;
        
        specificFeedback = 'La descripción usa lenguaje accesible y claro, lo cual conecta con las preferencias del segmento controlador por la simplicidad y transparencia.';
      } else {
        score = 35 + Math.random() * 30;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} La descripción tiene muchas palabras complicadas. Yo prefiero que me expliquen las cosas sencillas, sin tanto tecnicismo.

${this.getRandomExpression(languagePatterns.formal_expressions)} para mi familia necesitamos algo que todos entendamos. Si desde la descripción ya está complicado, me da miedo que el servicio también lo sea.

Prefiero cosas más claras y directas. ¿No tienen una explicación más sencilla de lo que realmente ofrecen?`;
        
        specificFeedback = 'La descripción es demasiado técnica o compleja para el segmento controlador, que prefiere explicaciones simples y directas.';
        improvementSuggestion = 'Simplificar el lenguaje, usar términos familiares y enfocarse en beneficios claros para la familia.';
      }
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const hasModernTerms = concept.description && (
        concept.description.toLowerCase().includes('smart') ||
        concept.description.toLowerCase().includes('innovador') ||
        concept.description.toLowerCase().includes('tecnología') ||
        concept.description.toLowerCase().includes('experiencia')
      );

      if (hasModernTerms) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} La descripción suena súper moderna e innovadora. Es exactamente el tipo de tecnología que me emociona probar y compartir en mis redes.

Como diseñadora, siempre estoy buscando cosas que estén a la vanguardia. Esta descripción me da esa sensación de que es algo nuevo y emocionante. ${this.getRandomExpression(languagePatterns.informal_expressions)}

${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Definitivamente quiero ser de las primeras en probarlo! Esto se va a ver increíble en mis stories y va a generar muchas preguntas de mis seguidores.`;
        
        specificFeedback = 'La descripción captura perfectamente el interés del segmento joven con términos modernos y enfoque en innovación tecnológica.';
      } else {
        score = 35 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `Mmm, la descripción suena muy básica y común. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} No me da esa sensación de innovación que busco.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre estoy pendiente de las últimas tendencias, y esta descripción no me emociona para nada. Suena como algo que cualquier operadora podría ofrecer.

Para mi contenido en redes necesito algo que sea más wow, más actual. Esta descripción no me inspira a compartirla con mis seguidores.`;
        
        specificFeedback = 'La descripción no transmite innovación ni modernidad, aspectos clave para captar la atención del segmento joven y digital.';
        improvementSuggestion = 'Incluir términos más modernos, enfatizar la innovación tecnológica y la experiencia de usuario diferenciada.';
      }
    }
    // Continuar con otros arquetipos...
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || `La descripción me parece ${score > 60 ? 'interesante' : 'regular'}.`,
      specific_feedback: specificFeedback || 'Evaluación general de la descripción.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateBenefitsReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    const benefits = concept.benefits || [];
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    if (archetype === TigoArchetype.EMPRENDEDOR) {
      const businessBenefits = benefits.filter(benefit => 
        benefit.toLowerCase().includes('negocio') ||
        benefit.toLowerCase().includes('ventas') ||
        benefit.toLowerCase().includes('clientes') ||
        benefit.toLowerCase().includes('whatsapp') ||
        benefit.toLowerCase().includes('redes sociales')
      );

      if (businessBenefits.length > 0) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Estos beneficios sí me sirven para mi negocio! Especialmente lo de WhatsApp y redes sociales, porque así es como me comunico con mis clientes diariamente.

${this.getRandomExpression(languagePatterns.formal_expressions)}, necesito herramientas que me ayuden a vender más y atender mejor a los clientes. Si esto me permite recibir pedidos más rápido y coordinar entregas, definitivamente me conviene.

${this.getRandomExpression(languagePatterns.price_related)} porque si me ayuda a generar más ingresos, vale la pena la inversión. ¿Tienen casos de otros emprendedores que hayan visto resultados?`;
        
        specificFeedback = `Los beneficios están alineados con las necesidades del emprendedor. Enfoque en herramientas de negocio como WhatsApp Business y redes sociales que son fundamentales para este segmento.`;
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `Los beneficios están bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no veo cómo específicamente me van a ayudar a generar más ventas en mi negocio.

${this.getRandomExpression(languagePatterns.formal_expressions)}, yo necesito herramientas que me ayuden con los clientes, con los pedidos, con las promociones. Estos beneficios son muy generales.

¿Podrían ser más específicos sobre cómo esto mejora las ventas o facilita la comunicación con clientes?`;
        
        specificFeedback = 'Los beneficios no abordan específicamente las necesidades empresariales del segmento emprendedor.';
        improvementSuggestion = 'Enfatizar beneficios relacionados con WhatsApp Business, redes sociales, herramientas de pago y comunicación con clientes.';
      }
    } else if (archetype === TigoArchetype.PRAGMATICO) {
      const essentialBenefits = benefits.filter(benefit => 
        benefit.toLowerCase().includes('básico') ||
        benefit.toLowerCase().includes('esencial') ||
        benefit.toLowerCase().includes('llamadas') ||
        benefit.toLowerCase().includes('whatsapp') ||
        benefit.toLowerCase().includes('simple')
      );

      if (essentialBenefits.length > 0 && benefits.length <= 4) {
        score = 70 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.informal_expressions)} Los beneficios me parecen buenos porque son lo básico que uno necesita. No me gustan los servicios con muchas cosas raras que uno nunca va a usar.

${this.getRandomExpression(languagePatterns.quality_related)} para lo que necesito: llamadas, WhatsApp y un poco de internet. Eso es suficiente para mí, no pido más.

${this.getRandomExpression(languagePatterns.price_related)}, y que realmente funcione bien. Con tal que haga lo que promete, me sirve perfectamente.`;
        
        specificFeedback = 'Los beneficios están alineados con la preferencia del segmento pragmático por servicios esenciales y funcionales.';
      } else {
        score = 35 + Math.random() * 30;
        sentiment = 'neutral';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} Hay muchos beneficios y me parece complicado. Yo prefiero algo simple, con lo básico que realmente necesito.

${this.getRandomExpression(languagePatterns.formal_expressions)} no necesito tantas funciones raras. Con llamadas, mensajes y un poco de internet tengo suficiente.

¿No tienen algo más sencillo? Porque tantos beneficios me dan miedo que sea caro o complicado de usar.`;
        
        specificFeedback = 'Demasiados beneficios pueden overwhelmar al segmento pragmático que prefiere simplicidad.';
        improvementSuggestion = 'Simplificar los beneficios, enfocarse en lo esencial: llamadas, WhatsApp, internet básico.';
      }
    }
    // Continuar con otros arquetipos...
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'Los beneficios me parecen regulares.',
      specific_feedback: specificFeedback || 'Evaluación general de beneficios.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateDifferentiationReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const hasInnovation = concept.differentiation && (
        concept.differentiation.toLowerCase().includes('único') ||
        concept.differentiation.toLowerCase().includes('exclusivo') ||
        concept.differentiation.toLowerCase().includes('primero') ||
        concept.differentiation.toLowerCase().includes('innovador') ||
        concept.differentiation.toLowerCase().includes('tecnología')
      );

      if (hasInnovation) {
        score = 85 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Me encanta que sea algo único y exclusivo! Eso es exactamente lo que busco - ser de las primeras en tener algo diferente.

Como creativa, siempre estoy buscando cosas que destaquen y que me hagan ver cool entre mi círculo. ${this.getRandomExpression(languagePatterns.informal_expressions)} Si es exclusivo o tiene alguna tecnología nueva, definitivamente mis seguidores van a querer saber más.

${this.getRandomExpression(languagePatterns.decision_expressions)} ¡Esto es perfecto para generar contenido! La diferenciación me parece súper fuerte y definitivamente es algo que compartería en mis stories.`;
        
        specificFeedback = 'La diferenciación conecta perfectamente con la necesidad del segmento joven de destacar y ser early adopters de innovaciones.';
      } else {
        score = 30 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No veo qué lo hace diferente de lo que ya existe. Para mi contenido en redes, necesito algo que realmente destaque.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre estoy pendiente de las últimas tendencias, y esto suena como algo que todas las operadoras están ofreciendo. No me da esa sensación de exclusividad.

¿Qué lo hace especial? Porque así como está, no me inspira a recomendarlo o compartirlo con mis seguidores.`;
        
        specificFeedback = 'La diferenciación no es suficientemente fuerte para captar el interés del segmento joven que busca exclusividad e innovación.';
        improvementSuggestion = 'Enfatizar aspectos únicos, exclusivos o de primera mover advantage que generen sentido de pertenencia especial.';
      }
    } else if (archetype === TigoArchetype.RESIGNADO) {
      // Para este arquetipo, la diferenciación importa menos
      score = 45 + Math.random() * 20;
      sentiment = 'neutral';
      reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} No entiendo mucho de esas diferencias. Para mí lo importante es que funcione y sea accesible.

${this.getRandomExpression(languagePatterns.informal_expressions)} Mientras me sirva para lo básico y no sea muy complicado de usar, está bien. No necesito que sea el más moderno o diferente.

${this.getRandomExpression(languagePatterns.decision_expressions)} Lo que sí necesito es que sea confiable y que no me traiga problemas.`;
      
      specificFeedback = 'El segmento resignado valora menos la diferenciación, priorizando confiabilidad y simplicidad sobre innovación.';
    } else if (archetype === TigoArchetype.PROFESIONAL) {
      const hasProfessionalDiff = concept.differentiation && (
        concept.differentiation.toLowerCase().includes('productividad') ||
        concept.differentiation.toLowerCase().includes('eficiencia') ||
        concept.differentiation.toLowerCase().includes('profesional') ||
        concept.differentiation.toLowerCase().includes('corporativo')
      );

      if (hasProfessionalDiff) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} La diferenciación me parece sólida y enfocada en lo que realmente importa profesionalmente. Me gusta que no sea solo marketing sino beneficios reales.

${this.getRandomExpression(languagePatterns.quality_related)} En mi trabajo necesito herramientas que me den ventajas competitivas reales, no solo funciones bonitas. Esta diferenciación se ve práctica.

${this.getRandomExpression(languagePatterns.decision_expressions)} ¿Tienen estudios que comprueben esta diferenciación? Porque suena prometedor para el entorno corporativo.`;
        
        specificFeedback = 'La diferenciación está alineada con valores profesionales de productividad y eficiencia empresarial.';
      } else {
        score = 40 + Math.random() * 30;
        sentiment = 'neutral';
        reactionText = `La diferenciación está bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no veo cómo esto específicamente me ayuda en mi trabajo diario más que las otras opciones.

${this.getRandomExpression(languagePatterns.formal_expressions)} necesito diferenciadores que realmente impacten la productividad o eficiencia. Esta diferenciación me parece muy general.

¿Podrían ser más específicos sobre las ventajas profesionales únicas que ofrece?`;
        
        specificFeedback = 'La diferenciación no comunica claramente ventajas específicas para el segmento profesional.';
        improvementSuggestion = 'Enfocar la diferenciación en beneficios profesionales medibles: productividad, eficiencia, herramientas corporativas exclusivas.';
      }
    }
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'La diferenciación me parece regular.',
      specific_feedback: specificFeedback || 'Evaluación general de diferenciación.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateTargetAudienceReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype, age, occupation } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    // Verificar si el público objetivo incluye al persona
    const targetAudience = concept.target_audience?.toLowerCase() || '';
    let isIncluded = false;
    
    if (archetype === TigoArchetype.PROFESIONAL) {
      isIncluded = targetAudience.includes('profesional') || 
                   targetAudience.includes('ejecutivo') || 
                   targetAudience.includes('empresa') ||
                   targetAudience.includes('corporativo') ||
                   targetAudience.includes('gerente');
                   
      if (isIncluded) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Perfecto! Me siento totalmente identificado con el público objetivo. Es exactamente para personas como yo que trabajamos en entornos corporativos.

${this.getRandomExpression(languagePatterns.formal_expressions)} veo que entienden las necesidades específicas de los profesionales. Eso me da mucha confianza porque significa que el producto está diseñado pensando en nuestro trabajo.

${this.getRandomExpression(languagePatterns.decision_expressions)} Cuando el targeting es tan preciso, usualmente los beneficios están mejor alineados con lo que realmente necesitamos.`;
        
        specificFeedback = 'El público objetivo está perfectamente alineado con el perfil profesional, generando alta identificación y confianza.';
      } else {
        score = 35 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No me siento incluido en el público objetivo. Parece que no está pensado para profesionales como yo.

${this.getRandomExpression(languagePatterns.formal_expressions)} si el producto no está dirigido específicamente a usuarios corporativos, probablemente no va a satisfacer mis necesidades profesionales.

Necesitaría ver una versión que esté claramente dirigida al segmento empresarial.`;
        
        specificFeedback = 'El público objetivo no incluye claramente al segmento profesional, generando desconexión.';
        improvementSuggestion = 'Incluir específicamente a profesionales, ejecutivos y usuarios corporativos en el público objetivo.';
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      isIncluded = targetAudience.includes('familia') || 
                   targetAudience.includes('hogar') || 
                   targetAudience.includes('madre') ||
                   targetAudience.includes('padre') ||
                   targetAudience.includes('administrador');
                   
      if (isIncluded) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.informal_expressions)} Me parece bien que sea para familias como la nuestra. Se ve que entienden que somos nosotros los que manejamos el presupuesto familiar.

${this.getRandomExpression(languagePatterns.formal_expressions)} cuando un producto está dirigido específicamente a familias, usualmente tiene mejores precios y condiciones más justas.

${this.getRandomExpression(languagePatterns.decision_expressions)} Eso me da confianza porque significa que van a considerar nuestras necesidades familiares.`;
        
        specificFeedback = 'El público objetivo reconoce el rol familiar del segmento controlador, generando identificación y confianza.';
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No estoy segura si este producto es para familias como la nuestra. El público objetivo suena muy general.

${this.getRandomExpression(languagePatterns.formal_expressions)} prefiero productos que sean claros sobre ser para familias, porque así sé que van a pensar en nuestro presupuesto.

¿Está dirigido a familias o es más bien para uso individual?`;
        
        specificFeedback = 'El público objetivo no es suficientemente específico sobre orientación familiar.';
        improvementSuggestion = 'Mencionar específicamente familias, hogares o administradores del presupuesto familiar.';
      }
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      isIncluded = targetAudience.includes('joven') || 
                   targetAudience.includes('millennial') || 
                   targetAudience.includes('creativo') ||
                   targetAudience.includes('digital') ||
                   targetAudience.includes('influencer') ||
                   (age >= 18 && age <= 35 && (targetAudience.includes('18-35') || targetAudience.includes('25-35')));
                   
      if (isIncluded) {
        score = 85 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Súper! Es exactamente para mi generación. Me encanta cuando las marcas entienden que somos diferentes de otros segmentos.

Como ${occupation.toLowerCase()}, me identifico totalmente con el público objetivo. ${this.getRandomExpression(languagePatterns.informal_expressions)} Eso significa que van a tener funciones y beneficios pensados para nosotros.

${this.getRandomExpression(languagePatterns.excitement_expressions)} Definitivamente es para mi círculo. Esto se va a ver perfecto cuando lo comparta en mis redes.`;
        
        specificFeedback = 'El público objetivo está perfectamente alineado con el perfil joven y digital, generando alta conexión emocional.';
      } else {
        score = 25 + Math.random() * 30;
        sentiment = 'negativo';
        reactionText = `Mmm, no me siento parte del público objetivo. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} Suena como algo para gente mayor o muy tradicional.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre busco productos que estén dirigidos específicamente a mi generación, que entiendan nuestras necesidades digitales.

Esto no me da la sensación de que sea para jóvenes creativos como yo.`;
        
        specificFeedback = 'El público objetivo no captura al segmento joven y digital, perdiendo conexión con este arquetipo.';
        improvementSuggestion = 'Incluir específicamente jóvenes, millennials, creativos digitales y usuarios de redes sociales.';
      }
    }
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'El público objetivo me parece regular.',
      specific_feedback: specificFeedback || 'Evaluación general del público objetivo.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateChannelReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    const channel = concept.channel?.toLowerCase() || '';
    
    if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const digitalChannels = ['instagram', 'tiktok', 'youtube', 'facebook', 'redes sociales', 'influencer', 'digital'];
      const hasDigitalChannel = digitalChannels.some(ch => channel.includes(ch));
      
      if (hasDigitalChannel) {
        score = 85 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Perfecto! Estos son exactamente los canales donde paso mi tiempo. Instagram, TikTok y YouTube son mi vida diaria.

Como creativa digital, estos canales son ideales para mí. ${this.getRandomExpression(languagePatterns.informal_expressions)} Es donde realmente puedo ver el producto en acción y donde voy a compartir mi experiencia.

${this.getRandomExpression(languagePatterns.excitement_expressions)} Me encanta que usen influencers y redes sociales. Es la forma más auténtica de conocer productos nuevos.`;
        
        specificFeedback = 'Los canales digitales están perfectamente alineados con los hábitos de consumo del segmento joven y digital.';
      } else {
        score = 30 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} Los canales no son los que uso. Radio, TV o puntos de venta no son donde busco información sobre tecnología.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre me informo por redes sociales, YouTube o a través de influencers. Estos canales tradicionales no me llegan.

¿No tienen presencia digital? Porque es donde realmente está mi generación.`;
        
        specificFeedback = 'Los canales no conectan con los hábitos digitales del segmento joven.';
        improvementSuggestion = 'Incluir canales digitales como Instagram, TikTok, YouTube e influencers para conectar con el segmento joven.';
      }
    } else if (archetype === TigoArchetype.RESIGNADO) {
      const traditionalChannels = ['radio', 'televisión', 'tv', 'punto de venta', 'familia', 'recomendación', 'boca a boca'];
      const hasTraditionalChannel = traditionalChannels.some(ch => channel.includes(ch));
      
      if (hasTraditionalChannel) {
        score = 70 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} Está bien que usen radio y televisión. Yo siempre veo las noticias y escucho radio, entonces ahí me entero de las cosas.

${this.getRandomExpression(languagePatterns.informal_expressions)} También me gusta que mencionen las recomendaciones familiares. Yo siempre le pregunto a mis hijos o nietos qué piensan.

${this.getRandomExpression(languagePatterns.decision_expressions)} Los puntos de venta también son importantes porque ahí uno puede preguntar bien y que le expliquen.`;
        
        specificFeedback = 'Los canales tradicionales y familiares conectan bien con los hábitos de información del segmento resignado.';
      } else {
        score = 35 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No entiendo mucho de esos canales. Yo me informo por la televisión y la radio, o me preguntan mis hijos.

${this.getRandomExpression(languagePatterns.formal_expressions)} prefiero los canales conocidos, donde uno puede entender bien. Esas cosas de internet no las manejo.

¿No van a anunciar en radio o televisión? Porque ahí sí me enteraría.`;
        
        specificFeedback = 'Los canales no son accesibles para el segmento resignado que prefiere medios tradicionales.';
        improvementSuggestion = 'Incluir canales tradicionales como radio, televisión, puntos de venta y recomendaciones familiares.';
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      const familyChannels = ['familia', 'recomendación', 'boca a boca', 'punto de venta', 'call center'];
      const trustChannels = familyChannels.some(ch => channel.includes(ch));
      
      if (trustChannels) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.informal_expressions)} Me gusta que incluyan recomendaciones familiares y puntos de venta. Yo siempre prefiero que me recomienden personas de confianza.

${this.getRandomExpression(languagePatterns.formal_expressions)} en los puntos de venta uno puede preguntar todo, comparar precios y que le expliquen bien las condiciones. Eso me da seguridad.

${this.getRandomExpression(languagePatterns.decision_expressions)} Voy a preguntarle a mi familia qué piensan, y después ir al punto de venta a verificar todo.`;
        
        specificFeedback = 'Los canales de confianza y familiares conectan perfectamente con la necesidad de validación del segmento controlador.';
      } else {
        score = 45 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No sé si confío completamente en esos canales. Yo prefiero que me recomiende gente de confianza o ir personalmente al punto de venta.

${this.getRandomExpression(languagePatterns.formal_expressions)} necesito poder preguntar bien, comparar y estar segura antes de decidir. Los canales muy comerciales me dan desconfianza.

¿Tienen puntos de venta donde uno pueda ir a preguntar directamente?`;
        
        specificFeedback = 'Los canales no proporcionan la validación y confianza que busca el segmento controlador.';
        improvementSuggestion = 'Incluir puntos de venta físicos, call center y enfatizar recomendaciones familiares para generar confianza.';
      }
    } else if (archetype === TigoArchetype.PROFESIONAL) {
      const professionalChannels = ['linkedin', 'email', 'digital', 'presentaciones', 'webinar', 'sitio web'];
      const hasProfessionalChannel = professionalChannels.some(ch => channel.includes(ch));
      
      if (hasProfessionalChannel) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} Excelentes canales para profesionales. LinkedIn y email son donde realmente presto atención a propuestas de negocio.

${this.getRandomExpression(languagePatterns.quality_related)} Los canales digitales profesionales me permiten revisar la información con calma y compartirla con mi equipo si es necesario.

${this.getRandomExpression(languagePatterns.decision_expressions)} Me gusta que usen canales serios y profesionales. Eso me genera más confianza en el producto.`;
        
        specificFeedback = 'Los canales profesionales están perfectamente alineados con los hábitos de consumo de información del segmento corporativo.';
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `Los canales están bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no son los más efectivos para llegar a profesionales como yo.

${this.getRandomExpression(languagePatterns.formal_expressions)} prefiero canales más dirigidos al segmento corporativo. LinkedIn, webinars o presentaciones ejecutivas serían más apropiados.

¿Tienen una estrategia específica para el canal corporativo? Porque estos canales son muy masivos.`;
        
        specificFeedback = 'Los canales no están optimizados para el segmento profesional que prefiere comunicación corporativa especializada.';
        improvementSuggestion = 'Incluir canales profesionales como LinkedIn, email marketing B2B, webinars y presentaciones ejecutivas.';
      }
    }
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'Los canales me parecen regulares.',
      specific_feedback: specificFeedback || 'Evaluación general de canales.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateToneReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    const tone = concept.tone?.toLowerCase() || '';
    
    if (archetype === TigoArchetype.PROFESIONAL) {
      const professionalTones = ['profesional', 'serio', 'confiable', 'corporativo', 'formal', 'técnico'];
      const hasProfessionalTone = professionalTones.some(t => tone.includes(t));
      
      if (hasProfessionalTone) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} El tono me parece perfecto para el entorno profesional. Es serio, confiable y transmite la credibilidad que busco.

${this.getRandomExpression(languagePatterns.quality_related)} En presentaciones con clientes o en videollamadas corporativas, necesito que todo se vea profesional y bien estructurado.

${this.getRandomExpression(languagePatterns.excitement_expressions)} Este tono definitivamente funciona para mi segmento. Me da confianza para recomendarlo en mi entorno de trabajo.`;
        
        specificFeedback = 'El tono profesional y serio conecta perfectamente con las expectativas del segmento corporativo.';
      } else {
        score = 35 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} El tono no me parece apropiado para el ámbito profesional. Suena demasiado casual o informal.

${this.getRandomExpression(languagePatterns.formal_expressions)} necesito un tono que pueda usar en presentaciones corporativas sin quedar mal. Este tono no me genera la confianza necesaria.

¿Podrían usar un enfoque más serio y profesional? Porque así no lo puedo recomendar en mi entorno de trabajo.`;
        
        specificFeedback = 'El tono no es apropiado para el segmento profesional que requiere seriedad y credibilidad corporativa.';
        improvementSuggestion = 'Usar un tono más profesional, serio y confiable que sea apropiado para entornos corporativos.';
      }
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const coolTones = ['divertido', 'cool', 'trendy', 'joven', 'fresco', 'moderno', 'creativo', 'dinámico'];
      const hasCoolTone = coolTones.some(t => tone.includes(t));
      
      if (hasCoolTone) {
        score = 85 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡El tono está increíble! Es exactamente lo que me gusta - fresco, moderno y con personalidad. ¡Me encanta!

Como creativa, aprecio mucho cuando las marcas tienen un tono auténtico y no aburrido. ${this.getRandomExpression(languagePatterns.informal_expressions)} Este tono definitivamente conecta conmigo y con mi generación.

${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Esto se va a ver perfecto en mis stories! El tono es compartible y va a generar engagement con mis seguidores.`;
        
        specificFeedback = 'El tono cool y moderno conecta perfectamente con la personalidad del segmento joven y creativo.';
      } else {
        score = 30 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `El tono suena muy aburrido y serio. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} No tiene esa personalidad que busco en las marcas que sigo.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre prefiero marcas que tengan un tono más fresco y auténtico. Este tono no me inspira a compartirlo.

Necesitan más personalidad, más energía. Algo que realmente conecte con mi generación.`;
        
        specificFeedback = 'El tono no captura la energía y personalidad que busca el segmento joven y digital.';
        improvementSuggestion = 'Usar un tono más fresco, dinámico y con personalidad que conecte con el segmento joven.';
      }
    } else if (archetype === TigoArchetype.CONTROLADOR) {
      const trustingTones = ['honesto', 'transparente', 'claro', 'directo', 'familiar', 'cercano', 'confiable'];
      const hasTrustingTone = trustingTones.some(t => tone.includes(t));
      
      if (hasTrustingTone) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.informal_expressions)} Me gusta que el tono sea claro y directo. No me gustan las cosas complicadas o que suenen como pura promoción.

${this.getRandomExpression(languagePatterns.formal_expressions)} cuando una marca habla así de honesto, me da más confianza. Parece que realmente se preocupan por las familias como la nuestra.

${this.getRandomExpression(languagePatterns.decision_expressions)} Este tono me hace sentir que puedo confiar en lo que dicen. No suena como esas promesas que luego no cumplen.`;
        
        specificFeedback = 'El tono transparente y familiar conecta con la necesidad de confianza del segmento controlador.';
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} El tono me suena muy comercial. Prefiero que me hablen más directo y honesto, sin tanto rollo publicitario.

${this.getRandomExpression(languagePatterns.formal_expressions)} necesito que me hablen claro, como hablaría con un vecino o familia. Este tono me genera un poco de desconfianza.

¿No pueden ser más directos y honestos? Porque así suena como pura publicidad.`;
        
        specificFeedback = 'El tono es percibido como demasiado comercial para el segmento controlador que valora la autenticidad.';
        improvementSuggestion = 'Usar un tono más transparente, directo y familiar que genere confianza genuina.';
      }
    }
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'El tono me parece regular.',
      specific_feedback: specificFeedback || 'Evaluación general del tono.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateCallToActionReaction(concept: CampaignConcept, persona: PersonaProfile, languagePatterns: any): VariableReaction {
    const { archetype } = persona;
    let reactionText = '';
    let specificFeedback = '';
    let score = 50;
    let sentiment: any = 'neutral';
    let improvementSuggestion = '';

    const cta = concept.call_to_action?.toLowerCase() || '';
    
    if (archetype === TigoArchetype.CONTROLADOR) {
      const lowPressureCTAs = ['consulta', 'infórmate', 'compara', 'pregunta', 'visita', 'llama para más información'];
      const hasLowPressureCTA = lowPressureCTAs.some(c => cta.includes(c));
      const hasHighPressure = cta.includes('compra ya') || cta.includes('ahora') || cta.includes('oferta limitada') || cta.includes('solo hoy');
      
      if (hasLowPressureCTA && !hasHighPressure) {
        score = 75 + Math.random() * 20;
        sentiment = 'positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.informal_expressions)} Me gusta que me inviten a informarme primero sin presionarme a comprar de una vez. Eso me da confianza.

${this.getRandomExpression(languagePatterns.formal_expressions)} siempre prefiero poder consultar, comparar precios y preguntarle a mi familia antes de decidir. Este call to action respeta eso.

${this.getRandomExpression(languagePatterns.decision_expressions)} Voy a consultar primero, comparar con otras opciones, y si me convence, entonces sí voy a considerarlo seriamente.`;
        
        specificFeedback = 'El CTA respeta el proceso de decisión del segmento controlador que necesita tiempo para evaluar y comparar.';
      } else if (hasHighPressure) {
        score = 25 + Math.random() * 25;
        sentiment = 'negativo';
        reactionText = `${this.getRandomExpression(languagePatterns.skepticism_expressions)} No me gusta que me presionen a decidir rápido. Esas tácticas de "compra ya" o "oferta limitada" me dan desconfianza.

${this.getRandomExpression(languagePatterns.formal_expressions)} cuando algo es bueno, no necesita presión. Yo necesito tiempo para pensarlo bien, comparar precios y consultarlo con mi familia.

Este tipo de call to action me hace dudar de si realmente es una buena oferta.`;
        
        specificFeedback = 'El CTA de alta presión genera desconfianza en el segmento controlador que valora decisiones meditadas.';
        improvementSuggestion = 'Usar CTAs más consultivos como "Infórmate", "Consulta" o "Compara" que respeten el proceso de evaluación.';
      }
    } else if (archetype === TigoArchetype.GOMOSO_EXPLORADOR) {
      const excitingCTAs = ['pruébalo ya', 'descúbrelo', 'vive la experiencia', 'sé el primero', 'consíguelo ahora'];
      const hasExcitingCTA = excitingCTAs.some(c => cta.includes(c));
      
      if (hasExcitingCTA) {
        score = 85 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Me encanta el call to action! Es energético y me da ganas de probarlo inmediatamente. "Sé el primero" o "Descúbrelo" me emocionan.

Como creativa digital, me gustan las marcas que me invitan a experimentar y ser early adopter. ${this.getRandomExpression(languagePatterns.informal_expressions)} Este CTA definitivamente me motiva a actuar.

${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Ya quiero probarlo y compartir la experiencia! Este tipo de call to action me hace sentir especial y única.`;
        
        specificFeedback = 'El CTA emocionante conecta perfectamente con la personalidad aventurera del segmento joven y explorador.';
      } else {
        score = 35 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `El call to action está muy básico y aburrido. ${this.getRandomExpression(languagePatterns.skepticism_expressions)} No me genera emoción ni ganas de actuar inmediatamente.

${this.getRandomExpression(languagePatterns.formal_expressions)}, siempre me llaman la atención los CTAs más creativos y energéticos. Este no me inspira para nada.

Necesitan algo más wow, más emocionante que me haga querer probarlo ya.`;
        
        specificFeedback = 'El CTA carece de la energía y emoción que busca el segmento joven para motivar la acción inmediata.';
        improvementSuggestion = 'Usar CTAs más emocionantes como "Pruébalo ya", "Sé el primero" o "Vive la experiencia" que generen excitement.';
      }
    } else if (archetype === TigoArchetype.PROFESIONAL) {
      const professionalCTAs = ['solicita una demo', 'agenda una reunión', 'descarga el brochure', 'contáctanos', 'evalúa la solución'];
      const hasProfessionalCTA = professionalCTAs.some(c => cta.includes(c));
      
      if (hasProfessionalCTA) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.formal_expressions)} Excelente call to action, muy profesional y apropiado para el ámbito corporativo. Me gusta que sea serio y directo.

${this.getRandomExpression(languagePatterns.quality_related)} Un CTA como "Solicita una demo" o "Agenda una reunión" me permite evaluar el producto adecuadamente antes de decidir.

${this.getRandomExpression(languagePatterns.decision_expressions)} Definitivamente voy a solicitar más información. Este tipo de enfoque profesional me genera confianza en la empresa.`;
        
        specificFeedback = 'El CTA profesional está perfectamente alineado con el proceso de evaluación corporativa del segmento profesional.';
      } else {
        score = 40 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `El call to action está bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no es el más apropiado para decisiones corporativas.

${this.getRandomExpression(languagePatterns.formal_expressions)} necesito un proceso más estructurado para evaluar soluciones profesionales. CTAs como "Compra ya" no funcionan en mi entorno.

¿Tienen un proceso de evaluación empresarial? Porque necesito algo más formal y profesional.`;
        
        specificFeedback = 'El CTA no está optimizado para el proceso de decisión corporativa que requiere evaluación estructurada.';
        improvementSuggestion = 'Usar CTAs más corporativos como "Solicita demo", "Agenda reunión" o "Descarga información técnica".';
      }
    } else if (archetype === TigoArchetype.EMPRENDEDOR) {
      const businessCTAs = ['mejora tu negocio', 'aumenta tus ventas', 'haz crecer tu empresa', 'optimiza tu negocio'];
      const hasBusinessCTA = businessCTAs.some(c => cta.includes(c));
      
      if (hasBusinessCTA) {
        score = 80 + Math.random() * 15;
        sentiment = 'muy_positivo';
        reactionText = `${this.getRandomExpression(languagePatterns.excitement_expressions)} ¡Ese call to action sí me habla directo! "Mejora tu negocio" o "Aumenta tus ventas" es exactamente lo que busco.

${this.getRandomExpression(languagePatterns.formal_expressions)}, todo lo que haga crecer mi negocio me interesa. Este CTA me dice claramente qué beneficio voy a obtener.

${this.getRandomExpression(languagePatterns.decision_expressions)} Si realmente me va a ayudar a generar más ingresos, definitivamente lo voy a probar.`;
        
        specificFeedback = 'El CTA orientado a beneficios de negocio conecta perfectamente con las motivaciones del segmento emprendedor.';
      } else {
        score = 45 + Math.random() * 25;
        sentiment = 'neutral';
        reactionText = `El call to action está bien, pero ${this.getRandomExpression(languagePatterns.skepticism_expressions)} no me dice cómo me va a beneficiar en mi negocio.

${this.getRandomExpression(languagePatterns.formal_expressions)}, necesito saber qué voy a ganar. CTAs que hablen de mejorar ventas o hacer crecer el negocio me motivan más.

¿Cómo me va a ayudar esto a generar más ingresos? Eso es lo que realmente me importa.`;
        
        specificFeedback = 'El CTA no comunica claramente los beneficios de negocio que motivarían al segmento emprendedor.';
        improvementSuggestion = 'Enfocar el CTA en beneficios de negocio como "Aumenta tus ventas" o "Haz crecer tu empresa".';
      }
    }
    
    return {
      sentiment,
      score: Math.round(score),
      reaction_text: reactionText || 'El call to action me parece regular.',
      specific_feedback: specificFeedback || 'Evaluación general del call to action.',
      improvement_suggestion: improvementSuggestion || undefined
    };
  }

  private static generateGenericReaction(variable: EvaluationVariable): VariableReaction {
    return {
      sentiment: 'neutral',
      score: 60,
      reaction_text: `Mi reacción a ${variable} es neutral.`,
      specific_feedback: `Evaluación de ${variable} requiere más desarrollo.`
    };
  }
}