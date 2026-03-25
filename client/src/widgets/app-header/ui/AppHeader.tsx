import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/theme-switcher/ui/ThemeSwitcher';
import styles from './AppHeader.module.css';

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
