// components/Search/ChatHistorySearch.tsx - Búsqueda semántica en historial de chats

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Clock, MessageSquare, X, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { chatStorage } from '../../lib/chatStorage';
import type { ChatMessage } from '../../types';

interface SearchResult {
  message: ChatMessage;
  mode: 'general' | 'creative';
  relevance: number;
  snippet: string;
}

interface ChatHistorySearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage?: (message: ChatMessage, mode: string) => void;
  className?: string;
}

const ChatHistorySearch: React.FC<ChatHistorySearchProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMessage,
  className 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7d' | '30d' | '90d'>('all');

  // Obtener todos los mensajes de ambos modos
  const getAllMessages = useMemo(() => {
    const generalMessages = chatStorage.getMessages('general').map(msg => ({ 
      ...msg, 
      mode: 'general' as const 
    }));
    const creativeMessages = chatStorage.getMessages('creative').map(msg => ({ 
      ...msg, 
      mode: 'creative' as const 
    }));
    
    return [...generalMessages, ...creativeMessages];
  }, []);

  // Filtrar mensajes por período
  const filterByPeriod = (messages: any[]) => {
    const now = new Date();
    const periodInMs = {
      'all': Infinity,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    const cutoffTime = now.getTime() - periodInMs[selectedPeriod];
    
    return messages.filter(msg => 
      new Date(msg.timestamp).getTime() >= cutoffTime
    );
  };

  // Búsqueda semántica simple (se puede mejorar con embeddings)
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular búsqueda con delay
    setTimeout(() => {
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(/\s+/);
      
      const filteredMessages = filterByPeriod(getAllMessages);
      
      const results: SearchResult[] = filteredMessages
        .map(msg => {
          const contentLower = msg.content.toLowerCase();
          
          // Calcular relevancia basada en coincidencias
          let relevance = 0;
          let matchedWords = 0;
          
          queryWords.forEach(word => {
            if (contentLower.includes(word)) {
              matchedWords++;
              // Contar ocurrencias
              const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
              relevance += matches;
            }
          });
          
          // Bonus si todos los términos están presentes
          if (matchedWords === queryWords.length) {
            relevance *= 2;
          }
          
          // Bonus para mensajes con citas
          if (msg.citations && msg.citations.length > 0) {
            relevance += 0.5;
          }
          
          // Crear snippet con contexto
          const snippetLength = 150;
          const firstMatch = queryWords.find(word => contentLower.indexOf(word) !== -1);
          const matchIndex = firstMatch ? contentLower.indexOf(firstMatch) : 0;
          const snippetStart = Math.max(0, matchIndex - 50);
          const snippetEnd = Math.min(msg.content.length, snippetStart + snippetLength);
          const snippet = msg.content.substring(snippetStart, snippetEnd);
          
          return {
            message: msg,
            mode: msg.mode || 'general',
            relevance,
            snippet: snippetStart > 0 ? '...' + snippet : snippet
          };
        })
        .filter(result => result.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 20); // Top 20 resultados
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, selectedPeriod]);

  const handleSelectResult = (result: SearchResult) => {
    if (onSelectMessage) {
      onSelectMessage(result.message, result.mode);
    }
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const queryWords = query.toLowerCase().split(/\s+/);
    let highlightedText = text;
    
    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Búsqueda en Historial
              </h2>
              <p className="text-sm text-gray-600">
                Busca en todas tus conversaciones anteriores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en conversaciones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Período:</span>
            <div className="flex gap-1">
              {(['all', '7d', '30d', '90d'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-lg transition-colors",
                    selectedPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {period === 'all' ? 'Todo' : 
                   period === '7d' ? 'Última semana' :
                   period === '30d' ? 'Último mes' : 
                   'Últimos 3 meses'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600">Buscando...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        result.mode === 'creative' 
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      )}>
                        {result.mode === 'creative' ? 'Creativo' : 'General'}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        result.message.role === 'user'
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      )}>
                        {result.message.role === 'user' ? 'Tú' : 'Tigo RAG'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(result.message.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900">
                    {highlightText(result.snippet, searchQuery)}
                    {result.snippet.length < result.message.content.length && '...'}
                  </div>

                  {result.message.citations && result.message.citations.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {result.message.citations.length} fuentes citadas
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>Relevancia: {Math.round(result.relevance * 10)} / 10</span>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No se encontraron resultados</p>
              <p className="text-sm text-gray-500 mt-1">
                Intenta con otros términos o ajusta el período de búsqueda
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Ingresa términos para buscar</p>
              <p className="text-sm text-gray-500 mt-1">
                Busca en {getAllMessages.length} mensajes de tus conversaciones
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                <strong>{chatStorage.getStats('general').total}</strong> mensajes en General
              </span>
              <span>
                <strong>{chatStorage.getStats('creative').total}</strong> mensajes en Creativo
              </span>
            </div>
            {searchResults.length > 0 && (
              <span>
                {searchResults.length} resultados encontrados
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistorySearch;