import { useEffect, type JSX } from 'react';
import { useUser } from './providers/UserProvider';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from './MenuBar';

export const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (!user) navigate('/');
  }, [user]);
  return (
    <>
      <MenuBar />
      {children}
    </>
  );
};
