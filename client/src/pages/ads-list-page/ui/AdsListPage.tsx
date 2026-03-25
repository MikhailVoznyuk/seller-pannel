import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppHeader } from '@/widgets/app-header/ui/AppHeader';
import {AdsHeading} from "@/widgets/ads-heading/ui/AdsHeading";
import { AdsFilters } from '@/widgets/ads-filters/ui/AdsFilters';
import { AdsToolbar } from '@/widgets/ads-toolbar/ui/AdsToolbar';
import { AdsCatalog } from '@/widgets/ads-catalog/ui/AdsCatalog';
import { fetchAds } from '@/entities/ad/api/ad-api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  resetFilters,
  selectAdsUi,
  setLayout,
  setNeedsRevisionOnly,
  setPage,
  setSearch,
  setSorting,
  toggleCategory,
} from '@/app/store/slices/adsUiSlice';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { Pagination } from '@/shared/ui/pagination/Pagination';
import { PageShell } from '@/shared/ui/page-shell/PageShell';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';
import styles from './AdsListPage.module.css';

const PAGE_SIZE = 10;

export function AdsListPage() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(selectAdsUi);
  const [searchValue, setSearchValue] = useState(ui.search);
  const debouncedSearch = useDebouncedValue(searchValue);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setSearchValue(ui.search);
  }, [ui.search]);

  const adsQuery = useQuery({
    queryKey: ['ads', ui],
    queryFn: ({ signal }) =>
      fetchAds(
        {
          q: ui.search,
          limit: PAGE_SIZE,
          skip: (ui.page - 1) * PAGE_SIZE,
          categories: ui.categories.join(',') || undefined,
          needsRevision: ui.needsRevisionOnly,
          sortColumn: ui.sortColumn,
          sortDirection: ui.sortDirection,
        },
        signal,
      ),
  });

  const totalPages = Math.max(1, Math.ceil((adsQuery.data?.total ?? 0) / PAGE_SIZE));

  return (
    <PageShell header={<AppHeader />}>
      <div className={styles.layout}>
      <AdsHeading total={adsQuery.data?.total ?? 0} />
      <AdsToolbar

          searchValue={searchValue}
          onSearchChange={setSearchValue}
          layout={ui.layout}
          onLayoutChange={(value) => dispatch(setLayout(value))}
          sortColumn={ui.sortColumn}
          sortDirection={ui.sortDirection}
          onSortingChange={(value) => dispatch(setSorting(value))}
      />
      <div className={styles.container}>

          <AdsFilters
              categories={ui.categories}
              needsRevisionOnly={ui.needsRevisionOnly}
              onCategoryToggle={(category) => dispatch(toggleCategory(category))}
              onNeedsRevisionChange={(value) => dispatch(setNeedsRevisionOnly(value))}
              onReset={() => dispatch(resetFilters())}
          />

          <section className={styles.content}>

              {adsQuery.isLoading ? (
                  <StatusCard title="Загрузка объявлений"></StatusCard>
              ) : null}

              {adsQuery.isError ? (
                  <StatusCard title="Ошибка загрузки" tone="error">
                      {(adsQuery.error as Error).message || 'Не удалось загрузить список объявлений.'}
                  </StatusCard>
              ) : null}

              {adsQuery.data ? <AdsCatalog items={adsQuery.data.items} layout={ui.layout} /> : null}

              <Pagination page={ui.page} totalPages={totalPages} onChange={(page) => dispatch(setPage(page))} />
          </section>
      </div>

      </div>
    </PageShell>
  );
}
