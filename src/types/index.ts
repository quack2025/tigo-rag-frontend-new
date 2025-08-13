export interface Citation {
  document: string;
  study_type: string;
  year: string | number;
  similarity: number;
  section: string;
}

export interface Visualization {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any[];
  insights?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: 'general' | 'creative';
  citations?: Citation[];
  visualization?: Visualization;
  metadata?: {
    processing_time_seconds?: number;
    chunks_retrieved?: number;
    confidence?: number;
    [key: string]: any;
  };
}

export interface RAGResponse {
  success: boolean;
  answer: string;
  content: string;
  citations: Citation[];
  visualization?: any;
  metadata?: any;
  timestamp?: string;
}

export interface ConfigOption {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}