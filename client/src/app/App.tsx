import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router/router';
import { AppProviders } from '@/app/providers';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
