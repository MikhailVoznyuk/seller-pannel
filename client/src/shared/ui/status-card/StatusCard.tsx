import type { PropsWithChildren } from 'react';
import styles from './StatusCard.module.css';

type Props = PropsWithChildren<{
  title: string;
  tone?: 'info' | 'warning' | 'error' | 'success';
}>;

export function StatusCard({ title, tone = 'info', children }: Props) {
  return (
    <section className={`${styles.card} ${styles[tone]}`}>
      <h3 className={styles.title}>{title}</h3>
      {children ? <div className={styles.content}>{children}</div> : null}
    </section>
  );
}
