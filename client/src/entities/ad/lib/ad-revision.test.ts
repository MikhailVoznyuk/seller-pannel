import { getMissingAdFields, resolveNeedsRevision } from '@/entities/ad/lib/ad-revision';

describe('ad revision helpers', () => {
  it('returns missing optional params and description', () => {
    const result = getMissingAdFields({
      category: 'electronics',
      params: {
        brand: 'Apple',
        model: 'MacBook Pro',
      },
      description: '',
    });

    expect(result).toContain('Тип');
    expect(result).toContain('Цвет');
    expect(result).toContain('Состояние');
    expect(result).toContain('Описание');
  });

  it('resolves needsRevision as true when fields are missing', () => {
    expect(
      resolveNeedsRevision({
        id: 1,
        category: 'auto',
        title: 'Toyota',
        price: 1000000,
        createdAt: new Date().toISOString(),
        params: {},
      }),
    ).toBe(true);
  });

  it('resolves needsRevision as false for complete item', () => {
    expect(
      resolveNeedsRevision({
        id: 2,
        category: 'real_estate',
        title: 'Квартира',
        price: 12000000,
        createdAt: new Date().toISOString(),
        description: 'Полное описание',
        params: {
          type: 'flat',
          address: 'Москва',
          area: 42,
          floor: 3,
        },
      }),
    ).toBe(false);
  });

  it('trusts explicit needsRevision flag from server for list items', () => {
    expect(
      resolveNeedsRevision({
        id: 3,
        category: 'electronics',
        title: 'Наушники',
        price: 5000,
        createdAt: new Date().toISOString(),
        needsRevision: false,
      }),
    ).toBe(false);
  });
});
