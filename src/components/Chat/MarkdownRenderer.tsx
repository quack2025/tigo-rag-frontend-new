// components/Chat/MarkdownRenderer.tsx - Renderizador de Markdown

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Encabezados
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-gray-900 mt-3 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium text-gray-800 mt-2 mb-1 first:mt-0">
              {children}
            </h4>
          ),
          
          // Párrafos
          p: ({ children }) => (
            <p className="text-gray-700 mb-2 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          
          // Listas
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-2 ml-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-2 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 text-sm">
              {children}
            </li>
          ),
          
          // Texto en negrita y cursiva
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
          
          // Código
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            
            if (isBlock) {
              return (
                <pre className="bg-gray-100 rounded-lg p-3 mb-2 overflow-x-auto text-sm">
                  <code className="text-gray-800 font-mono">
                    {children}
                  </code>
                </pre>
              );
            }
            
            return (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            );
          },
          
          // Citas
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 mb-2 bg-blue-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          
          // Tablas
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border border-gray-300 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-medium text-gray-900 border-b border-gray-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-gray-700 border-b border-gray-200">
              {children}
            </td>
          ),
          
          // Enlaces
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          
          // Línea horizontal
          hr: () => (
            <hr className="border-gray-300 my-4" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;