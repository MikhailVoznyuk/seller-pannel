import { AdCard } from '@/entities/ad/ui/AdCard';
import type { AdLayout, AdListItem } from '@/entities/ad/model/types';
import { EmptyState } from '@/shared/ui/empty-state/EmptyState';
import styles from './AdsCatalog.module.css';

type Props = {
  items: AdListItem[];
  layout: AdLayout;
};

export function AdsCatalog({ items, layout }: Props) {
  if (!items.length) {
    return (
      <EmptyState
        title="Ничего не найдено"
        description="Поменяй фильтры или строку поиска. Объявления не испарились, просто ты их сам спрятал."
      />
    );
  }

  return (
    <section className={`${styles.catalog} ${layout === 'list' ? styles.list : ''}`}>
      {items.map((item) => (
        <AdCard key={item.id} item={item} layout={layout} />
      ))}
    </section>
  );
}
