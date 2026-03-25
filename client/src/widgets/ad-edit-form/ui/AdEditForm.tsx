import { useMemo } from 'react';
import { Sparkles, WalletCards } from 'lucide-react';
import { adFieldConfig, categoryOptions } from '@/entities/ad/model/field-config';
import { getMissingOptionalParamFields } from '@/entities/ad/lib/ad-revision';
import type { EditDraft } from '@/entities/ad/model/types';
import { Button } from '@/shared/ui/button/Button';
import { Input } from '@/shared/ui/input/Input';
import { Select } from '@/shared/ui/select/Select';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';
import styles from './AdEditForm.module.css';

type Props = {
  value: EditDraft;
  errors: Partial<Record<'category' | 'title' | 'price', string>>;
  onChange: (next: EditDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  onGenerateDescription: () => void;
  onGeneratePrice: () => void;
  onApplyDescription: () => void;
  onApplyPrice: () => void;
  onCloseDescriptionSuggestion: () => void;
  onClosePriceSuggestion: () => void;
  descriptionSuggestion: string;
  priceSuggestion: { price: number; comment: string } | null;
  isSaving: boolean;
  isPriceLoading: boolean;
  isDescriptionLoading: boolean;
  requestError: string;
  saveError: string;
  aiEnabled?: boolean;
};

export function AdEditForm({
  value,
  errors,
  onChange,
  onSave,
  onCancel,
  onGenerateDescription,
  onGeneratePrice,
  onApplyDescription,
  onApplyPrice,
  onCloseDescriptionSuggestion,
  onClosePriceSuggestion,
  descriptionSuggestion,
  priceSuggestion,
  isSaving,
  isPriceLoading,
  isDescriptionLoading,
  requestError,
  saveError,
  aiEnabled = false,
}: Props) {
  const fields = adFieldConfig[value.category];
  const missingOptional = useMemo(
    () =>
      getMissingOptionalParamFields({
        category: value.category,
        params: value.params,
      }),
    [value.category, value.params],
  );

  const updateParam = (key: string, nextValue: string) => {
    const field = fields.find((item) => item.key === key);

    onChange({
      ...value,
      params: {
        ...value.params,
        [key]:
          field?.type === 'number'
            ? nextValue === ''
              ? ''
              : Number(nextValue)
            : nextValue,
      },
    });
  };

  const isValid = Boolean(value.category) && Boolean(value.title.trim()) && Number(value.price) > 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Редактирование объявления</h1>
        </div>
      </div>

      <div className={styles.form}>
        {requestError ? (
          <StatusCard title="Ошибка AI" tone="error">
            {requestError}
          </StatusCard>
        ) : null}

        {saveError ? (
          <StatusCard title="Ошибка сохранения" tone="error">
            {saveError}
          </StatusCard>
        ) : null}

        <Select
          variant="primary"
          label="Категория"
          options={categoryOptions}
          value={value.category}
          onChange={(event) =>
            onChange({
              ...value,
              category: event.target.value as EditDraft['category'],
              params: {},
            })
          }
          error={errors.category}
        />

        <hr />

        <Input
          variant="primary"
          label="* Название"
          placeholder="Введите название"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          onClear={() => onChange({ ...value, title: '' })}
          error={errors.title}
        />

        <hr />

        <div className={styles.priceRow}>
          <Input
            variant="primary"
            label="* Цена"
            placeholder="Введите цену"
            value={value.price}
            onChange={(event) =>
              onChange({
                ...value,
                price: event.target.value === '' ? '' : Number(event.target.value),
              })
            }
            onClear={() => onChange({ ...value, price: '' })}
            error={errors.price}
          />

          {aiEnabled ? (
            <Button variant="warning" onClick={onGeneratePrice} loading={isPriceLoading}>
              <WalletCards size={16} />
              {priceSuggestion ? 'Повторить запрос' : 'Узнать рыночную цену'}
            </Button>
          ) : null}
        </div>

        {aiEnabled && priceSuggestion ? (
          <div className={styles.tooltip}>
            <h3 className={styles.tooltipTitle}>Ответ AI</h3>
            <p className={styles.tooltipText}>{priceSuggestion.comment}</p>
            <div className={styles.tooltipActions}>
              <Button variant="primary" onClick={onApplyPrice}>
                Применить
              </Button>
              <Button variant="secondary" onClick={onClosePriceSuggestion}>
                Закрыть
              </Button>
            </div>
          </div>
        ) : null}

        <hr />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Характеристики</h2>
          <div className={styles.fields}>
            {fields.map((field) => {
              const warning = missingOptional.includes(field.label);
              const fieldValue = value.params[field.key as keyof typeof value.params] ?? '';
              const label = field.key === 'type' ? `* ${field.label}` : field.label;

              if (field.type === 'select') {
                return (
                  <Select
                    key={field.key}
                    label={label}
                    options={field.options ?? []}
                    value={String(fieldValue)}
                    onChange={(event) => updateParam(field.key, event.target.value)}
                    warning={warning}
                  />
                );
              }

              return (
                <Input
                  key={field.key}
                  label={label}
                  type={field.type}
                  value={fieldValue}
                  onChange={(event) => updateParam(field.key, event.target.value)}
                  onClear={() => updateParam(field.key, '')}
                  warning={warning}
                />
              );
            })}
          </div>
        </section>

        <hr />

        <section className={styles.section}>
          <div className={styles.descriptionHeader}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            {aiEnabled ? (
              <Button variant="warning" onClick={onGenerateDescription} loading={isDescriptionLoading}>
                <Sparkles size={16} />
                {value.description.trim() ? 'Улучшить описание' : 'Придумать описание'}
              </Button>
            ) : null}
          </div>

          <label className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              maxLength={1000}
              placeholder="Введите описание"
              value={value.description}
              onChange={(event) => onChange({ ...value, description: event.target.value })}
            />
            <span className={styles.counter}>{value.description.length}/1000</span>
          </label>

          {aiEnabled && descriptionSuggestion ? (
            <div className={styles.tooltip}>
              <h3 className={styles.tooltipTitle}>Ответ AI</h3>
              <p className={styles.tooltipText}>{descriptionSuggestion}</p>
              <div className={styles.tooltipActions}>
                <Button variant="primary" onClick={onApplyDescription}>
                  Применить
                </Button>
                <Button variant="secondary" onClick={onCloseDescriptionSuggestion}>
                  Закрыть
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <div className={styles.actions}>
          <Button variant="primary" onClick={onSave} disabled={!isValid} loading={isSaving}>
            Сохранить
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Отменить
          </Button>
        </div>
      </div>
    </div>
  );
}
