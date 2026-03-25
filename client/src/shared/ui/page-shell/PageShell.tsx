import type { PropsWithChildren, ReactNode } from 'react';
import styles from './PageShell.module.css';

type Props = PropsWithChildren<{
  header: ReactNode;
}>;

export function PageShell({ header, children }: Props) {
  return (
    <div className={styles.page}>
      {header}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
