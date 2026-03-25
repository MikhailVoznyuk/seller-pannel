import { diffWords } from 'diff';

export function buildTextDiff(before: string, after: string) {
  return diffWords(before, after).map((part) => ({
    value: part.value,
    added: Boolean(part.added),
    removed: Boolean(part.removed),
  }));
}
