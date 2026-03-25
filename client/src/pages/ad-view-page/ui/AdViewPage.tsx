import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAd } from '@/entities/ad/api/ad-api';
import { AppHeader } from '@/widgets/app-header/ui/AppHeader';
import { AdViewCard } from '@/widgets/ad-view/ui/AdViewCard';
import { PageShell } from '@/shared/ui/page-shell/PageShell';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';

export function AdViewPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const adQuery = useQuery({
    queryKey: ['ad', id],
    queryFn: ({ signal }) => fetchAd(id, signal),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if ((location.state as { saved?: boolean } | null)?.saved) {
      const timeoutId = window.setTimeout(() => {
        navigate(location.pathname, { replace: true, state: null });
      }, 2000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <PageShell header={<AppHeader />}>
      <div style={{ marginTop: 20 }}>
        {adQuery.isLoading ? (
          <StatusCard tone="info" title="Загрузка объявления"></StatusCard>
        ) : null}

        {adQuery.isError ? (
          <StatusCard title="Ошибка загрузки" tone="error">
            {(adQuery.error as Error).message || 'Не удалось загрузить объявление.'}
          </StatusCard>
        ) : null}

        {adQuery.data ? (
          <AdViewCard item={adQuery.data} savedNotice={Boolean((location.state as { saved?: boolean } | null)?.saved)} />
        ) : null}
      </div>
    </PageShell>
  );
}
