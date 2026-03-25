import type { AiChatMessage, ChatAnswer, DescriptionSuggestion, DraftItem, PriceSuggestion } from './types.ts';
import { getMissingDraftFields } from './context.ts';

function compactParams(item: DraftItem) {
  return Object.values(item.params ?? {})
    .filter((value) => value !== '' && value !== null && value !== undefined)
    .map(String)
    .slice(0, 4)
    .join(', ');
}

export function getStubDescription(item: DraftItem): DescriptionSuggestion {
  const details = compactParams(item);
  const missing = getMissingDraftFields(item).filter((field) => field !== 'Описание');

  const description = [
    item.description?.trim() || `Продаётся ${item.title.trim() || 'товар'}${details ? `: ${details}.` : '.'}`,
    details ? `Ключевые характеристики: ${details}.` : 'Подробные характеристики пока заполнены не полностью.',
    missing.length ? `Для более сильного объявления стоит уточнить: ${missing.join(', ')}.` : 'Объявление выглядит заполненным и понятным для покупателя.',
  ].join(' ');

  return {
    description,
    source: 'stub',
  };
}

export function getStubPrice(item: DraftItem): PriceSuggestion {
  const currentPrice = typeof item.price === 'number' ? item.price : 0;
  const price = currentPrice > 0 ? currentPrice : item.category === 'real_estate' ? 6_500_000 : item.category === 'auto' ? 780_000 : 65_000;

  return {
    price,
    comment: `Ориентир по цене около ${price.toLocaleString('ru-RU')} ₽. Это упрощённая локальная подсказка без доступа к рынку, так что лучше проверить похожие объявления и скорректировать цену вручную.`,
    source: 'stub',
  };
}

export function getStubChatAnswer(item: DraftItem, question: string, messages: AiChatMessage[]): ChatAnswer {
  const normalized = question.toLowerCase();
  const missing = getMissingDraftFields(item);

  if (normalized.includes('чего') || normalized.includes('добав')) {
    return {
      answer: missing.length
        ? `Сейчас слабее всего раскрыты поля: ${missing.join(', ')}. Если дополнишь их и сделаешь описание чуть конкретнее, объявление станет убедительнее.`
        : 'Базовые поля уже заполнены. Дальше имеет смысл усилить описание: добавить конкретные преимущества, сценарии использования и состояние товара без воды.',
      source: 'stub',
    };
  }

  if (normalized.includes('цен')) {
    const price = typeof item.price === 'number' ? item.price.toLocaleString('ru-RU') : 'не указана';
    return {
      answer: `Сейчас в карточке стоит цена ${price} ₽. Для точной оценки лучше сравнить 5-10 похожих объявлений по этой категории и состоянию, потому что локальная заглушка рынок не видит.`,
      source: 'stub',
    };
  }

  return {
    answer: messages.length > 2
      ? 'Я смотрю на текущее объявление и историю диалога. В этом режиме могу подсказать, что ещё уточнить в описании, характеристиках и цене, но без внешней модели ответы будут упрощёнными.'
      : 'Могу помочь улучшить описание, подсказать, каких полей не хватает, и сориентировать по цене. Для более качественных ответов включи Ollama в настройках сервера.',
    source: 'stub',
  };
}
