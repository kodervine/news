import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useReduxHook';

const ProtectedRoutes = () => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/register" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
