import { Navigate } from 'react-router-dom';
import { getSessionUser } from '../utils/session';

const SecureAdminRoute = ({ children }) => {
  // Leemos el usuario logueado de forma segura (acepta currentUser / users)
  const user = getSessionUser();

  // Solo pueden entrar admin o empleado
  const hasPermission = user && (user.role === 'admin' || user.role === 'empleado');

  return hasPermission ? children : <Navigate to="/login" replace />;
};

export default SecureAdminRoute;
