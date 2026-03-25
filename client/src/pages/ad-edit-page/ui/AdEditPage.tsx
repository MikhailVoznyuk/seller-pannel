import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchAd,
  requestDescriptionSuggestion,
  requestPriceSuggestion,
  updateAd,
} from '@/entities/ad/api/ad-api';
import { clearDraft, loadDraft, saveDraft } from '@/entities/ad/lib/draft-storage';
import { toEditDraft } from '@/entities/ad/lib/ad-format';
import type { EditDraft } from '@/entities/ad/model/types';
import { useAbortGroup } from '@/shared/lib/use-abort-group';
import { AppHeader } from '@/widgets/app-header/ui/AppHeader';
import { AI_ENABLED } from '@/shared/config/features';
import { AdEditForm } from '@/widgets/ad-edit-form/ui/AdEditForm';
import { AiAssistantPanel } from '@/widgets/ai-assistant/ui/AiAssistantPanel';
import { PageShell } from '@/shared/ui/page-shell/PageShell';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';
import styles from './AdEditPage.module.css';

function validateDraft(draft: EditDraft) {
  return {
    category: draft.category ? '' : 'Категория обязательна',
    title: draft.title.trim() ? '' : 'Название обязательно',
    price: Number(draft.price) > 0 ? '' : 'Цена должна быть больше 0',
  };
}

export function AdEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { createController } = useAbortGroup();

  const adQuery = useQuery({
    queryKey: ['ad-edit', id],
    queryFn: ({ signal }) => fetchAd(id, signal),
    enabled: Boolean(id),
  });

  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [originalDescription, setOriginalDescription] = useState('');
  const [descriptionSuggestion, setDescriptionSuggestion] = useState('');
  const [priceSuggestion, setPriceSuggestion] = useState<{ price: number; comment: string } | null>(null);
  const [requestError, setRequestError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  useEffect(() => {
    if (!adQuery.data) {
      return;
    }

    const serverDraft = toEditDraft(adQuery.data);
    const localDraft = loadDraft(id);
    const nextDraft = localDraft ?? serverDraft;

    setDraft(nextDraft);
    setOriginalDescription(serverDraft.description);
  }, [adQuery.data, id]);

  useEffect(() => {
    if (!draft || !id) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveDraft(id, draft);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [draft, id]);

  const errors = useMemo(() => (draft ? validateDraft(draft) : { category: '', title: '', price: '' }), [draft]);

  const saveMutation = useMutation({
    mutationFn: async (payload: EditDraft) => {
      const { controller, release } = createController();

      try {
        return await updateAd(id, payload, controller.signal);
      } finally {
        release();
      }
    },
    onSuccess: () => {
      clearDraft(id);
      setSaveError('');
      setSaveNotice('Изменения сохранены успешно.');
      window.setTimeout(() => {
        navigate(`/ads/${id}`, { state: { saved: true } });
      }, 700);
    },
    onError: (error) => {
      setSaveError((error as Error).message || 'Ошибка сохранения');
    },
  });

  const handleGenerateDescription = async () => {
    if (!draft) return;
    setRequestError('');
    setIsDescriptionLoading(true);

    const { controller, release } = createController();

    try {
      const response = await requestDescriptionSuggestion({ item: draft }, controller.signal);
      setDescriptionSuggestion(response.description);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setRequestError((error as Error).message || 'Не удалось получить описание');
      }
    } finally {
      release();
      setIsDescriptionLoading(false);
    }
  };

  const handleGeneratePrice = async () => {
    if (!draft) return;
    setRequestError('');
    setIsPriceLoading(true);

    const { controller, release } = createController();

    try {
      const response = await requestPriceSuggestion({ item: draft }, controller.signal);
      setPriceSuggestion({
        price: response.price,
        comment: response.comment,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setRequestError((error as Error).message || 'Не удалось получить цену');
      }
    } finally {
      release();
      setIsPriceLoading(false);
    }
  };

  return (
    <PageShell header={<AppHeader />}>
      <div className={styles.page}>
        {adQuery.isLoading ? (
          <StatusCard title="Загрузка объявления">Подготавливаю форму редактирования.</StatusCard>
        ) : null}

        {adQuery.isError ? (
          <StatusCard title="Ошибка загрузки" tone="error">
            {(adQuery.error as Error).message || 'Не удалось загрузить объявление.'}
          </StatusCard>
        ) : null}

        {saveNotice ? (
          <StatusCard title="Сохранение" tone="success">
            {saveNotice}
          </StatusCard>
        ) : null}

        {draft ? (
          AI_ENABLED ? (
            <div className={styles.layout}>
              <AdEditForm
                value={draft}
                errors={errors}
                onChange={setDraft}
                onSave={() => saveMutation.mutate(draft)}
                onCancel={() => navigate(`/ads/${id}`)}
                onGenerateDescription={handleGenerateDescription}
                onGeneratePrice={handleGeneratePrice}
                onApplyDescription={() => {
                  setDraft({
                    ...draft,
                    description: descriptionSuggestion,
                  });
                  setDescriptionSuggestion('');
                }}
                onApplyPrice={() => {
                  if (!priceSuggestion) return;
                  setDraft({
                    ...draft,
                    price: priceSuggestion.price,
                  });
                  setPriceSuggestion(null);
                }}
                onCloseDescriptionSuggestion={() => setDescriptionSuggestion('')}
                onClosePriceSuggestion={() => setPriceSuggestion(null)}
                descriptionSuggestion={descriptionSuggestion}
                priceSuggestion={priceSuggestion}
                isSaving={saveMutation.isPending}
                isDescriptionLoading={isDescriptionLoading}
                isPriceLoading={isPriceLoading}
                requestError={requestError}
                saveError={saveError}
                aiEnabled={AI_ENABLED}
              />

              <AiAssistantPanel item={draft} originalDescription={originalDescription} aiEnabled={AI_ENABLED} />
            </div>
          ) : (
            <AdEditForm
              value={draft}
              errors={errors}
              onChange={setDraft}
              onSave={() => saveMutation.mutate(draft)}
              onCancel={() => navigate(`/ads/${id}`)}
              onGenerateDescription={handleGenerateDescription}
              onGeneratePrice={handleGeneratePrice}
              onApplyDescription={() => {
                setDraft({
                  ...draft,
                  description: descriptionSuggestion,
                });
                setDescriptionSuggestion('');
              }}
              onApplyPrice={() => {
                if (!priceSuggestion) return;
                setDraft({
                  ...draft,
                  price: priceSuggestion.price,
                });
                setPriceSuggestion(null);
              }}
              onCloseDescriptionSuggestion={() => setDescriptionSuggestion('')}
              onClosePriceSuggestion={() => setPriceSuggestion(null)}
              descriptionSuggestion={descriptionSuggestion}
              priceSuggestion={priceSuggestion}
              isSaving={saveMutation.isPending}
              isDescriptionLoading={isDescriptionLoading}
              isPriceLoading={isPriceLoading}
              requestError={requestError}
              saveError={saveError}
              aiEnabled={AI_ENABLED}
            />
          )
        ) : null}
      </div>
    </PageShell>
  );
}
