import { Link } from 'react-router-dom';
import { formatPrice } from '@/shared/lib/format-price';
import { getCategoryLabel } from '@/entities/ad/lib/ad-format';
import { resolveNeedsRevision } from '@/entities/ad/lib/ad-revision';
import type { AdLayout, AdListItem } from '@/entities/ad/model/types';
import styles from './AdCard.module.css';

type Props = {
  item: AdListItem;
  layout: AdLayout;
};

export function AdCard({ item, layout }: Props) {
  const needsRevision = resolveNeedsRevision(item);

  return (
    <Link className={`${styles.card} ${layout === 'list' ? styles.list : ''}`} to={`/ads/${item.id}`}>
      <div className={styles.image}>
        <img alt="" src={item.imageUrl || '/placeholder.svg'} />
      </div>
      <div className={styles.metaRow}>
        <span className={styles.category}>{getCategoryLabel(item.category)}</span>
      </div>

      <div className={styles.content}>


        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.price}>{formatPrice(item.price)}</p>
        {needsRevision ? (
          <div className={styles.badge}>
            <span className={styles.circle} />
            <span>Требует доработок</span>
          </div>

        )  : null}
      </div>
    </Link>
  );
}
