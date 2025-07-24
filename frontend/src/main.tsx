import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { Toaster } from './components/ui/sonner';
import { UserProvider } from './providers/UserProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster />
    </UserProvider>
  </StrictMode>
);
