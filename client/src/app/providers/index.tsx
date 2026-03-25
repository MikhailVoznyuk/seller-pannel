import type { PropsWithChildren } from 'react';
import { QueryProvider } from '@/app/providers/query-provider';
import { StoreProvider } from '@/app/providers/store-provider';
import { ThemeSync } from '@/app/providers/theme-sync';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeSync />
        {children}
      </QueryProvider>
    </StoreProvider>
  );
}
