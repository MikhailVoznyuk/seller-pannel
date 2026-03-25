import { adFieldConfig, categoryLabelMap } from '@/entities/ad/model/field-config';
import type { AdCategory, AdItem, AdParams } from '@/entities/ad/model/types';

export function getCategoryLabel(category: AdCategory) {
  return categoryLabelMap[category];
}

export function getReadableParamRows(category: AdCategory, params: AdParams) {
  return adFieldConfig[category]
    .map((field) => {
      const value = params[field.key as keyof AdParams];
      if (value === undefined || value === null || value === '') {
        return null;
      }

      const normalizedValue =
        field.type === 'select'
          ? field.options?.find((option) => option.value === value)?.label ?? String(value)
          : String(value);

      return {
        key: field.key,
        label: field.label,
        value: normalizedValue,
      };
    })
    .filter(Boolean) as Array<{ key: string; label: string; value: string }>;
}

export function toEditDraft(item: AdItem) {
  return {
    category: item.category,
    title: item.title,
    description: item.description ?? '',
    price: item.price,
    params: { ...item.params },
  };
}
