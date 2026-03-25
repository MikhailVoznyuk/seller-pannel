import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './Button.module.css';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'warning' | 'pagination';
    loading?: boolean;
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  variant = 'secondary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Загрузка...' : children}
    </button>
  );
}
