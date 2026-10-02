// src/services/SecureAdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const SecureAdminRoute = () => {
  // Aquí obtienes el usuario o token (desde localStorage, Context o Zustand/Redux)
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const isAdmin = user && user.role === 'admin'; 

  // Si es admin, muestra las rutas hijas; si no, redirige al home o login
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default SecureAdminRoute;