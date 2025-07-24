import { createBrowserRouter } from 'react-router-dom';
import ProductCRUD from './pages/products/ProductCRUD';
import Homepage from './pages/Homepage';
import ProductPage from './pages/products/ProductPage';

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
]);

export default router;
