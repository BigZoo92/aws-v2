import { createBrowserRouter } from 'react-router-dom';
import Auth from './pages/auth/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
  },
  {
    path: '/signup',
    element: <Auth />,
  },
]);

export default router;
