import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <SearchX size={28} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
