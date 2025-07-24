import { createBrowserRouter } from 'react-router-dom';
import ProductPage from './pages/products/ProductPage';
import Homepage from './pages/Homepage';
import ProductsPage from './products/ProductPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoutes } from './ProtectedRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/products',
    element: (
      <ProtectedRoutes>
        <ProductsPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/products/:id',
    element: (
      <ProtectedRoutes>
        <ProductPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoutes>
        <DashboardPage />
      </ProtectedRoutes>
    ),
  },
]);

export default router;
