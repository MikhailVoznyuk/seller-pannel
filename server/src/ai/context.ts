import type { DraftItem } from './types.ts';

const categoryLabels: Record<DraftItem['category'], string> = {
  auto: 'Транспорт',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
};

const paramLabels: Record<DraftItem['category'], Record<string, string>> = {
  auto: {
    brand: 'Марка',
    model: 'Модель',
    yearOfManufacture: 'Год выпуска',
    transmission: 'Коробка передач',
    mileage: 'Пробег, км',
    enginePower: 'Мощность, л.с.',
  },
  electronics: {
    type: 'Тип',
    brand: 'Бренд',
    model: 'Модель',
    condition: 'Состояние',
    color: 'Цвет',
  },
  real_estate: {
    type: 'Тип',
    address: 'Адрес',
    area: 'Площадь, м²',
    floor: 'Этаж',
  },
};

const valueLabels: Record<string, string> = {
  automatic: 'автомат',
  manual: 'механика',
  phone: 'смартфон',
  laptop: 'ноутбук',
  misc: 'другое',
  new: 'новое',
  used: 'б/у',
  flat: 'квартира',
  house: 'дом',
  room: 'комната',
};

function normalizeValue(value: unknown) {
  if (typeof value !== 'string') {
    return String(value);
  }

  return valueLabels[value] ?? value;
}

function listParams(item: DraftItem) {
  const entries = Object.entries(item.params ?? {}).filter(([, value]) => value !== '' && value !== null && value !== undefined);

  if (!entries.length) {
    return 'Характеристики не заполнены';
  }

  return entries
    .map(([key, value]) => `- ${paramLabels[item.category][key] ?? key}: ${normalizeValue(value)}`)
    .join('\n');
}

export function getDraftSnapshot(item: DraftItem) {
  return [
    `Категория: ${categoryLabels[item.category]}`,
    `Название: ${item.title.trim() || 'Не указано'}`,
    `Цена: ${typeof item.price === 'number' ? `${item.price} ₽` : 'Не указана'}`,
    `Описание: ${item.description?.trim() || 'Пусто'}`,
    'Характеристики:',
    listParams(item),
  ].join('\n');
}

export function getMissingDraftFields(item: DraftItem) {
  const missingParams = Object.entries(paramLabels[item.category])
    .filter(([key]) => {
      const value = item.params?.[key];
      return value === '' || value === null || value === undefined;
    })
    .map(([, label]) => label);

  return [
    ...missingParams,
    ...(item.description?.trim() ? [] : ['Описание']),
  ];
}
