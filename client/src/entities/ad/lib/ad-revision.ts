import { adFieldConfig } from '@/entities/ad/model/field-config';
import type { AdCategory, AdItem, AdListItem, AdParams } from '@/entities/ad/model/types';

function getMissingParams(category: AdCategory, params?: AdParams) {
  const source = params ?? {};
  return adFieldConfig[category]
    .filter((field) => {
      const value = source[field.key as keyof AdParams];
      return value === undefined || value === null || value === '';
    })
    .map((field) => field.label);
}

export function getMissingAdFields(item: Pick<AdItem, 'category' | 'params' | 'description'>) {
  const missingParams = getMissingParams(item.category, item.params);
  const descriptionMissing = !item.description?.trim();

  return [...missingParams, ...(descriptionMissing ? ['Описание'] : [])];
}

export function getMissingOptionalParamFields(item: Pick<AdItem, 'category' | 'params'>) {
  return getMissingParams(item.category, item.params);
}

export function resolveNeedsRevision(item: AdListItem | AdItem) {
  if ('needsRevision' in item && typeof item.needsRevision === 'boolean') {
    return item.needsRevision;
  }

  return (
    getMissingAdFields({
      category: item.category,
      params: item.params ?? {},
      description: item.description,
    }).length > 0
  );
}
