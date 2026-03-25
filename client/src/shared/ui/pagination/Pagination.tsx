import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';
import styles from './Pagination.module.css';

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <Button variant="pagination" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft size={28} />
      </Button>

      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, index) => {
          const item = index + 1;
          return (
            <button
              key={item}
              className={`${styles.page} ${item === page ? styles.active : ''}`}
              type="button"
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          );
        })}
      </div>

      <Button variant="pagination" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        <ChevronRight size={28} />
      </Button>
    </div>
  );
}
