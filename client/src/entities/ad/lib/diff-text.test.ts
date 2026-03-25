import { buildTextDiff } from '@/entities/ad/lib/diff-text';

describe('text diff', () => {
  it('marks inserted parts', () => {
    const parts = buildTextDiff('Продаю ноутбук', 'Продаю мощный ноутбук');
    expect(parts.some((part) => part.added && part.value.includes('мощный'))).toBe(true);
  });
});
