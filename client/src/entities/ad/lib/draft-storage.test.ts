import { clearDraft, loadDraft, saveDraft } from '@/entities/ad/lib/draft-storage';

describe('draft storage', () => {
  it('saves and restores draft by id', () => {
    const draft = {
      category: 'electronics' as const,
      title: 'MacBook Pro',
      description: 'Описание',
      price: 64000,
      params: {
        type: 'laptop' as const,
      },
    };

    saveDraft('42', draft);

    expect(loadDraft('42')).toEqual(draft);

    clearDraft('42');

    expect(loadDraft('42')).toBeNull();
  });
});
