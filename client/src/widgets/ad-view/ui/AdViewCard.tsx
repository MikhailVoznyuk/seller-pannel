import { Link } from 'react-router-dom';
import { PencilLine, ArrowLeft } from 'lucide-react';
import { getReadableParamRows } from '@/entities/ad/lib/ad-format';
import { getMissingAdFields } from '@/entities/ad/lib/ad-revision';
import type { AdItem } from '@/entities/ad/model/types';
import { formatDate } from '@/shared/lib/format-date';
import { formatPrice } from '@/shared/lib/format-price';
import { Button } from '@/shared/ui/button/Button';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';
import styles from './AdViewCard.module.css';

type Props = {
  item: AdItem;
  savedNotice?: boolean;
};

export function AdViewCard({ item, savedNotice = false }: Props) {
  const fields = getReadableParamRows(item.category, item.params);
  const missingFields = getMissingAdFields(item);

  return (
    <div className={styles.card}>
      <div className={styles.actions}>
        <Link to="/ads">
          <Button variant="ghost" style={{paddingLeft: 0}}>
            <ArrowLeft size={16} />
            К списку
          </Button>
        </Link>
      </div>

      {savedNotice ? (
        <StatusCard title="Изменения сохранены" tone="success" />
      ) : null}



      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{item.title}</h1>
          <Link to={`/ads/${item.id}/edit`}>
            <Button variant="primary" style={{padding: '8px 12px'}}>
              <PencilLine size={16} />
              Редактировать
            </Button>
          </Link>
        </div>

        <div className={styles.priceBlock}>
          <p className={styles.price}>{formatPrice(item.price)}</p>
          <p className={styles.date}>Опубликовано {formatDate(item.createdAt)}</p>
          {item.updatedAt ? <p className={styles.date}>Последнее изменение {formatDate(item.updatedAt)}</p> : null}
        </div>
      </div>

      <hr />

      <div className={styles.body}>
        <div className={styles.imageWrap}>
          <img alt="" src={item.imageUrl || '/placeholder.svg'} />
        </div>

        <div className={styles.meta}>
          <section className={styles.section}>
            {missingFields.length ? (
                <StatusCard title="Требуются доработки" tone="warning">
                  <div className={styles.warningContent}>
                    <p>Не заполнены поля:</p>
                    <ul>
                      {missingFields.map(field => (
                          <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </div>

                </StatusCard>
            ) : null}
            <h2 className={styles.sectionTitle}>Характеристики</h2>

            {fields.length ? (
              <dl className={styles.definitionList}>
                {fields.map((field) => (
                  <div key={field.key} className={styles.definitionRow}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className={styles.emptyText}>Характеристики не заполнены.</p>
            )}
          </section>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p className={styles.description}>{item.description?.trim() || 'Отсутствует'}</p>
      </section>
    </div>
  );
}
