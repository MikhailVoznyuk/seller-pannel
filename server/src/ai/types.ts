import type { Item } from '../types.ts';

export type DraftItem = {
  category: Item['category'];
  title: string;
  description?: string;
  price?: number | '';
  params?: Record<string, unknown>;
};

export type AiChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type DescriptionSuggestion = {
  description: string;
  source: 'llm' | 'stub';
};

export type PriceSuggestion = {
  price: number;
  comment: string;
  source: 'llm' | 'stub';
};

export type ChatAnswer = {
  answer: string;
  source: 'llm' | 'stub';
};
