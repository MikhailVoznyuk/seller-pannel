import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdsListPage } from '@/pages/ads-list-page/ui/AdsListPage';
import { AdViewPage } from '@/pages/ad-view-page/ui/AdViewPage';
import { AdEditPage } from '@/pages/ad-edit-page/ui/AdEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ads" replace />,
  },
  {
    path: '/ads',
    element: <AdsListPage />,
  },
  {
    path: '/ads/:id',
    element: <AdViewPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <AdEditPage />,
  },
]);
