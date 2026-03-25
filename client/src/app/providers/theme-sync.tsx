import { useEffect } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { selectTheme } from '@/app/store/slices/themeSlice';

export function ThemeSync() {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return null;
}
