import { createBrowserRouter } from 'react-router-dom';
import Auth from './pages/auth/auth';
import ProductCRUD from './pages/products/ProductCRUD';
import Homepage from './pages/Homepage';
import ProductPage from './pages/products/ProductPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/signup',
    element: <Auth />,
  },
  {
    path: '/products',
    element: <ProductCRUD />,
  },
  {
    path: '/products/:id',
    element: <ProductPage />,
  },
]);

export default router;
