import { X } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "primary" | "secondary";
  label?: string;
  fullWidth?: boolean;
  error?: string;
  warning?: boolean;
  onClear?: () => void;

};

export function Input({ label, error, warning, onClear, className = '', variant='secondary', fullWidth=false,  ...props }: Props) {
  return (
    <label className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label ? <span className={variant==='primary' ? styles.labelStrong : styles.label}>{label}</span> : null}
      <span className={`${styles.field}  ${warning ? styles.warning : ''} ${error ? styles.error : ''}`}>
        <input className={`${styles.input} ${className}`} {...props} />
        {onClear && props.value ? (
          <button className={styles.clear} type="button" onClick={onClear} aria-label="Очистить поле">
            <X size={14} />
          </button>
        ) : null}
      </span>
      {error ? <span className={styles.message}>{error}</span> : null}
    </label>
  );
}
