import { categoryOptions } from '@/entities/ad/model/field-config';
import type { AdCategory } from '@/entities/ad/model/types';
import { Button } from '@/shared/ui/button/Button';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { Switch } from '@/shared/ui/switch/Switch';
import styles from './AdsFilters.module.css';

type Props = {
  categories: AdCategory[];
  needsRevisionOnly: boolean;
  onCategoryToggle: (category: AdCategory) => void;
  onNeedsRevisionChange: (value: boolean) => void;
  onReset: () => void;
};

export function AdsFilters({
  categories,
  needsRevisionOnly,
  onCategoryToggle,
  onNeedsRevisionChange,
  onReset,
}: Props) {
  return (
    <aside className={styles.sidebar}>
    <div className={styles.content}>
        <section className={styles.group}>
            <h3 className={styles.title}>Фильтры</h3>
            <div className={styles.items}>
                {categoryOptions.map((option) => (
                    <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={categories.includes(option.value as AdCategory)}
                        onChange={() => onCategoryToggle(option.value as AdCategory)}
                    />
                ))}
            </div>
        </section>
        <hr/>
        <section className={styles.group}>
            <Switch
                variant='primary'
                checked={needsRevisionOnly}
                onChange={onNeedsRevisionChange}
                label="Только требующие доработок"
            />
        </section>
    </div>



      <Button variant="secondary" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </aside>
  );
}
