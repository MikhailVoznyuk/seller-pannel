import { buildChatMessages, buildDescriptionPrompt, buildPricePrompt, DESCRIPTION_SCHEMA, PRICE_SCHEMA } from './prompts.ts';
import { generateChatAnswer, generateJson } from './ollama.ts';
import { getStubChatAnswer, getStubDescription, getStubPrice } from './stub.ts';
import type { AiChatMessage, ChatAnswer, DescriptionSuggestion, DraftItem, PriceSuggestion } from './types.ts';

const AI_PROVIDER = (process.env.AI_PROVIDER || 'ollama').trim().toLowerCase();

export async function generateDescriptionSuggestion(item: DraftItem, signal?: AbortSignal): Promise<DescriptionSuggestion> {
  if (AI_PROVIDER === 'stub') {
    return getStubDescription(item);
  }

  const { system, prompt } = buildDescriptionPrompt(item);
  const response = await generateJson<{ description: string }>({
    system,
    prompt,
    format: DESCRIPTION_SCHEMA,
    signal,
  });

  return {
    description: response.description.trim(),
    source: 'llm',
  };
}

export async function generatePriceSuggestion(item: DraftItem, signal?: AbortSignal): Promise<PriceSuggestion> {
  if (AI_PROVIDER === 'stub') {
    return getStubPrice(item);
  }

  const { system, prompt } = buildPricePrompt(item);
  const response = await generateJson<{ price: number; comment: string }>({
    system,
    prompt,
    format: PRICE_SCHEMA,
    signal,
  });

  return {
    price: Math.max(1, Math.round(response.price)),
    comment: response.comment.trim(),
    source: 'llm',
  };
}

export async function generateChatReply(item: DraftItem, messages: AiChatMessage[], question: string, signal?: AbortSignal): Promise<ChatAnswer> {
  if (AI_PROVIDER === 'stub') {
    return getStubChatAnswer(item, question, messages);
  }

  const answer = await generateChatAnswer({
    messages: buildChatMessages(item, messages, question),
    signal,
  });

  return {
    answer,
    source: 'llm',
  };
}
