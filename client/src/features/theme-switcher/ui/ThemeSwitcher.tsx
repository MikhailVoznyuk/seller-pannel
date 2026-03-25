import { MoonStar, SunMedium } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectTheme, toggleTheme } from '@/app/store/slices/themeSlice';
import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return (
    <button className={styles.button} type="button" onClick={() => dispatch(toggleTheme())}>
      {theme === 'light' ? <MoonStar size={16} /> : <SunMedium size={16} />}
    </button>
  );
}
