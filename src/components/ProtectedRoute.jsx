import { useContext } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

function ProtectedRoute() {
  const {
    user,
    loading,
  } = useContext(AuthContext);

  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;