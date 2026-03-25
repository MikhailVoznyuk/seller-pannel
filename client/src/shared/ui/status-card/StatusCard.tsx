import type {ReactNode, PropsWithChildren } from 'react';
import {Icon} from '@/shared/ui/icon/Icon'
import styles from './StatusCard.module.css';

type Tone = 'info' | 'warning' | 'error' | 'success';
type Props = PropsWithChildren<{
  title: string;
  tone?: Tone;
}>;

function MatchIcon(tone: Tone): ReactNode {
  switch (tone) {
    case 'info':
      return null;
    case 'success':
      return (<Icon type='success' size={28}  />);
    case 'warning':
      return (<Icon type='warning' size={28} />);
    case 'error':
      return (<Icon type='error' size={28} />);

  }
}

export function StatusCard({ title, tone = 'info', children }: Props) {
  const notice: ReactNode = MatchIcon(tone);

  return (
    <section className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.header}>
        {notice}
        <h3 className={styles.title}>{title}</h3>
      </div>
      {children ? <div className={styles.content}>{children}</div> : null}

    </section>
  );
}
