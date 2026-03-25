import { Search } from 'lucide-react';
import { sortOptions } from '@/entities/ad/model/field-config';
import type { AdLayout, SortColumn, SortDirection } from '@/entities/ad/model/types';
import { LayoutToggle } from '@/features/layout-toggle/ui/LayoutToggle';
import { Input } from '@/shared/ui/input/Input';
import { Select } from '@/shared/ui/select/Select';
import styles from './AdsToolbar.module.css';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  layout: AdLayout;
  onLayoutChange: (layout: AdLayout) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSortingChange: (value: { sortColumn: SortColumn; sortDirection: SortDirection }) => void;
};

export function AdsToolbar({
  searchValue,
  onSearchChange,
  layout,
  onLayoutChange,
  sortColumn,
  sortDirection,
  onSortingChange,
}: Props) {
  const selectedSorting = `${sortColumn}-${sortDirection}`;

  return (
    <section className={styles.toolbar}>
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} size={16} />
          <Input
            fullWidth
            aria-label="Поиск по объявлениям"
            placeholder="Поиск по названию"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className={styles.searchInput}
          />
        </div>

        <LayoutToggle value={layout} onChange={onLayoutChange} />
        <Select
            aria-label="Сортировка"
            options={sortOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={selectedSorting}
            onChange={(event) => {
              const next = sortOptions.find((item) => item.value === event.target.value);
              if (next) {
                onSortingChange({
                  sortColumn: next.sortColumn,
                  sortDirection: next.sortDirection,
                });
              }
            }}
        />
      </div>
    </section>
  );
}
