// lib/chatStorage.ts - Sistema de almacenamiento de chats por modo

import type { ChatMessage } from '../types';

const STORAGE_KEYS = {
  general: 'tigo_chat_general',
  creative: 'tigo_chat_creative',
} as const;

export type ChatMode = keyof typeof STORAGE_KEYS;

class ChatStorageManager {
  // Obtener mensajes por modo
  getMessages(mode: ChatMode): ChatMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS[mode]);
      if (!stored) return [];
      
      const messages = JSON.parse(stored);
      // Convertir timestamps de string a Date
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error(`Error loading ${mode} messages:`, error);
      return [];
    }
  }

  // Guardar mensajes por modo
  saveMessages(mode: ChatMode, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS[mode], JSON.stringify(messages));
    } catch (error) {
      console.error(`Error saving ${mode} messages:`, error);
    }
  }

  // Agregar mensaje a un modo específico
  addMessage(mode: ChatMode, message: ChatMessage): ChatMessage[] {
    const messages = this.getMessages(mode);
    const newMessages = [...messages, message];
    this.saveMessages(mode, newMessages);
    return newMessages;
  }

  // Actualizar el último mensaje de un modo
  updateLastMessage(mode: ChatMode, updates: Partial<ChatMessage>): ChatMessage[] {
    const messages = this.getMessages(mode);
    if (messages.length === 0) return messages;

    const newMessages = [...messages];
    const lastIndex = newMessages.length - 1;
    newMessages[lastIndex] = { ...newMessages[lastIndex], ...updates };
    
    this.saveMessages(mode, newMessages);
    return newMessages;
  }

  // Limpiar mensajes de un modo específico
  clearMessages(mode: ChatMode): void {
    localStorage.removeItem(STORAGE_KEYS[mode]);
  }

  // Limpiar todos los mensajes
  clearAllMessages(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Exportar mensajes de un modo
  exportMessages(mode: ChatMode): string {
    const messages = this.getMessages(mode);
    return JSON.stringify({
      mode,
      exported_at: new Date().toISOString(),
      messages_count: messages.length,
      messages
    }, null, 2);
  }

  // Obtener estadísticas por modo
  getStats(mode: ChatMode) {
    const messages = this.getMessages(mode);
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    const messagesWithCitations = messages.filter(m => m.citations && m.citations.length > 0);

    return {
      total: messages.length,
      user: userMessages.length,
      assistant: assistantMessages.length,
      withCitations: messagesWithCitations.length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    };
  }
}

// Instancia singleton
export const chatStorage = new ChatStorageManager();