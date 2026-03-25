import type { AdCategory } from '@/entities/ad/model/types';

type SelectOption = {
  value: string;
  label: string;
};

type FieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: SelectOption[];
};

export const categoryOptions: SelectOption[] = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'auto', label: 'Транспорт' },
  { value: 'real_estate', label: 'Недвижимость' },
];

export const sortOptions: Array<
  SelectOption & {
    sortColumn: 'title' | 'createdAt';
    sortDirection: 'asc' | 'desc';
  }
> = [
  {
    value: 'createdAt-desc',
    label: 'Сначала новые',
    sortColumn: 'createdAt',
    sortDirection: 'desc',
  },
  {
    value: 'createdAt-asc',
    label: 'Сначала старые',
    sortColumn: 'createdAt',
    sortDirection: 'asc',
  },
  {
    value: 'title-asc',
    label: 'Название A-Я',
    sortColumn: 'title',
    sortDirection: 'asc',
  },
  {
    value: 'title-desc',
    label: 'Название Я-А',
    sortColumn: 'title',
    sortDirection: 'desc',
  },
];

export const adFieldConfig: Record<AdCategory, FieldConfig[]> = {
  electronics: [
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: [
        { value: '', label: 'Не выбран' },
        { value: 'phone', label: 'Смартфон' },
        { value: 'laptop', label: 'Ноутбук' },
        { value: 'misc', label: 'Другое' },
      ],
    },
    { key: 'brand', label: 'Бренд', type: 'text' },
    { key: 'model', label: 'Модель', type: 'text' },
    { key: 'color', label: 'Цвет', type: 'text' },
    {
      key: 'condition',
      label: 'Состояние',
      type: 'select',
      options: [
        { value: '', label: 'Не выбрано' },
        { value: 'new', label: 'Новое' },
        { value: 'used', label: 'Б/У' },
      ],
    },
  ],
  auto: [
    { key: 'brand', label: 'Марка', type: 'text' },
    { key: 'model', label: 'Модель', type: 'text' },
    { key: 'yearOfManufacture', label: 'Год выпуска', type: 'number' },
    {
      key: 'transmission',
      label: 'Коробка передач',
      type: 'select',
      options: [
        { value: '', label: 'Не выбрана' },
        { value: 'automatic', label: 'Автомат' },
        { value: 'manual', label: 'Механика' },
      ],
    },
    { key: 'mileage', label: 'Пробег, км', type: 'number' },
    { key: 'enginePower', label: 'Мощность, л.с.', type: 'number' },
  ],
  real_estate: [
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: [
        { value: '', label: 'Не выбран' },
        { value: 'flat', label: 'Квартира' },
        { value: 'house', label: 'Дом' },
        { value: 'room', label: 'Комната' },
      ],
    },
    { key: 'address', label: 'Адрес', type: 'text' },
    { key: 'area', label: 'Площадь, м²', type: 'number' },
    { key: 'floor', label: 'Этаж', type: 'number' },
  ],
};

export const categoryLabelMap: Record<AdCategory, string> = {
  electronics: 'Электроника',
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
};
