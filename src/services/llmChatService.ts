// services/llmChatService.ts - Servicio para chat dinámico con LLM

interface LLMChatRequest {
  userMessage: string;
  archetype: string;
  evaluationContext: any;
  conceptDetails: any;
  conversationHistory: any[];
  creativity: number; // 0-100
}

interface LLMChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

class LLMChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async generateDynamicResponse({
    userMessage,
    archetype,
    evaluationContext,
    conceptDetails,
    conversationHistory,
    creativity = 75
  }: LLMChatRequest): Promise<LLMChatResponse> {
    
    try {
      const token = localStorage.getItem('tigo_auth_token');

      const response = await fetch(`${this.baseUrl}/api/synthetic/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          user_message: userMessage,
          archetype,
          evaluation_context: evaluationContext,
          concept_details: conceptDetails,
          conversation_history: conversationHistory,
          creativity_level: creativity,
          language: 'spanish',
          cultural_context: 'honduras'
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.response,
        success: true
      };

    } catch (error) {
      console.error('Error en LLM Chat Service:', error);
      
      return {
        response: '',
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
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

export const llmChatService = new LLMChatService();
export type { LLMChatRequest, LLMChatResponse };