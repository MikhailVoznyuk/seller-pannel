import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

type Option = {
  value: string;
  label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: "primary" | "secondary";
  label?: string;
  options: Option[];
  error?: string;
  warning?: boolean;
};

export function Select({ label, options, error, warning, className = '', variant='secondary', ...props }: Props) {
  return (
    <label className={styles.wrapper}>
      {label ? <span className={variant==='primary' ? styles.labelStrong : styles.label}>{label}</span> : null}
      <select
        className={`${styles.select} ${warning ? styles.warning : ''} ${error ? styles.error : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className={styles.message}>{error}</span> : null}
    </label>
  );
}
