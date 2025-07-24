import { createBrowserRouter } from 'react-router-dom';
import ProductCRUD from './pages/products/ProductCRUD';
import Homepage from './pages/Homepage';
import ProductPage from './pages/products/ProductPage';
import DashboardPage from './pages/dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/products',
    element: <ProductCRUD />,
  },
  {
    path: '/products/:id',
    element: <ProductPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
]);

export default router;
