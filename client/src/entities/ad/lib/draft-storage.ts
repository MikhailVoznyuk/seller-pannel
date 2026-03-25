import type { EditDraft } from '@/entities/ad/model/types';

function getDraftKey(id: string) {
  return `ad-edit-draft:${id}`;
}

export function saveDraft(id: string, draft: EditDraft) {
  localStorage.setItem(getDraftKey(id), JSON.stringify(draft));
}

export function loadDraft(id: string) {
  const raw = localStorage.getItem(getDraftKey(id));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as EditDraft;
  } catch {
    return null;
  }
}

export function clearDraft(id: string) {
  localStorage.removeItem(getDraftKey(id));
}
