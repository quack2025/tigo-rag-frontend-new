// components/Chat/CitationsList.tsx - Componente para mostrar citas y fuentes

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText, Calendar } from 'lucide-react';
import type { Citation } from '../../types';
import { cn } from '../../lib/utils';

interface CitationsListProps {
  citations: Citation[];
  className?: string;
}

const CitationsList: React.FC<CitationsListProps> = ({ citations, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citations || citations.length === 0) {
    return null;
  }

  const displayCitations = isExpanded ? citations : citations.slice(0, 3);

  const getStudyTypeColor = (studyType: string) => {
    const type = studyType.toLowerCase();
    if (type.includes('survey')) return 'bg-blue-100 text-blue-800';
    if (type.includes('focus')) return 'bg-green-100 text-green-800';
    if (type.includes('interview')) return 'bg-purple-100 text-purple-800';
    if (type.includes('analysis')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };


  return (
    <div className={cn('mt-3 border-t border-gray-200 pt-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Fuentes ({citations.length})
          </span>
        </div>
        {citations.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                Mostrar menos <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Ver todas <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayCitations.map((citation, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <FileText className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {citation.document}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        getStudyTypeColor(citation.study_type)
                      )}>
                        {citation.study_type}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {citation.year}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Sección: {citation.section}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {citations.length > 3 && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          + {citations.length - 3} fuentes más
        </button>
      )}

      {citations.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          💡 Las fuentes están ordenadas por relevancia con tu consulta.
        </div>
      )}
    </div>
  );
};

export default CitationsList;