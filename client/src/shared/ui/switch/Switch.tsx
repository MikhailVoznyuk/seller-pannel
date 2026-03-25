import styles from './Switch.module.css';

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export function Switch({ checked, onChange, label }: Props) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <button
        className={`${styles.switch} ${checked ? styles.checked : ''}`}
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
}
