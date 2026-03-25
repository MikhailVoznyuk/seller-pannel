import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Checkbox({ label, ...props }: Props) {
  return (
    <label className={styles.wrapper}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
