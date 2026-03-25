import type { AiChatMessage, DraftItem } from './types.ts';
import { getDraftSnapshot, getMissingDraftFields } from './context.ts';

export const DESCRIPTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    description: {
      type: 'string',
    },
  },
  required: ['description'],
} as const;

export const PRICE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    price: {
      type: 'integer',
      minimum: 1,
    },
    comment: {
      type: 'string',
    },
  },
  required: ['price', 'comment'],
} as const;

export function buildDescriptionPrompt(item: DraftItem) {
  const missing = getMissingDraftFields(item).filter((field) => field !== 'Описание');

  return {
    system: [
      'Ты помогаешь продавцу улучшать карточку объявления.',
      'Пиши только на русском языке.',
      'Верни только JSON по схеме.',
      'Не выдумывай факты, которых нет во входных данных.',
      'Сделай описание готовым для вставки в объявление: 2-4 предложения, без markdown, без списков, без эмодзи.',
      'Текст должен звучать убедительно, но честно.',
    ].join(' '),
    prompt: [
      'Данные объявления:',
      getDraftSnapshot(item),
      missing.length ? `Можно мягко подсветить, что покупателю пригодились бы детали по полям: ${missing.join(', ')}.` : 'Все ключевые поля заполнены.',
      'Сгенерируй улучшенное описание для карточки.',
    ].join('\n\n'),
  };
}

export function buildPricePrompt(item: DraftItem) {
  return {
    system: [
      'Ты оцениваешь рыночную цену объявления для продавца.',
      'Пиши только на русском языке.',
      'Верни только JSON по схеме.',
      'Оценка должна быть осторожной и реалистичной.',
      'В поле comment дай короткий комментарий на 2-3 предложения без markdown.',
      'Если точность низкая, прямо напиши, что оценка ориентировочная.',
    ].join(' '),
    prompt: [
      'Данные объявления:',
      getDraftSnapshot(item),
      'Оцени разумную цену в рублях для публикации объявления сегодня.',
      'Верни целое число price и короткий comment.',
    ].join('\n\n'),
  };
}

export function buildChatMessages(item: DraftItem, messages: AiChatMessage[], question: string) {
  const trimmedHistory = messages.slice(-8);

  return [
    {
      role: 'system',
      content: [
        'Ты AI-помощник продавца объявления.',
        'Отвечай только на русском языке.',
        'Будь кратким, полезным и конкретным.',
        'Опирайся только на контекст объявления ниже и на вопрос пользователя.',
        'Если данных не хватает, скажи об этом прямо и предложи, что стоит уточнить.',
        'Не используй markdown-таблицы, не выдумывай характеристики и не обещай то, чего нет.',
        'Контекст объявления:',
        getDraftSnapshot(item),
      ].join('\n\n'),
    },
    ...trimmedHistory.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    {
      role: 'user',
      content: question,
    },
  ];
}
