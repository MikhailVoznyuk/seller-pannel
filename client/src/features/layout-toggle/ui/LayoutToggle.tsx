import { LayoutGrid, Rows3 } from 'lucide-react';
import type { AdLayout } from '@/entities/ad/model/types';
import styles from './LayoutToggle.module.css';

type Props = {
  value: AdLayout;
  onChange: (value: AdLayout) => void;
};

export function LayoutToggle({ value, onChange }: Props) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${value === 'grid' ? styles.active : ''}`}
        type="button"
        onClick={() => onChange('grid')}
      >
        <LayoutGrid size={16} />
      </button>
      <button
        className={`${styles.button} ${value === 'list' ? styles.active : ''}`}
        type="button"
        onClick={() => onChange('list')}
      >
        <Rows3 size={16} />
      </button>
    </div>
  );
}
