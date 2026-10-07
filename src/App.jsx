import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/Header.jsx';
import NavbarAdmin from './components/NavbarAdmin.jsx'; // 👈 Importamos el Navbar de Admin
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Addtocart from './pages/Addtocart.jsx';
import Searchedproduct from './pages/Searchedproduct.jsx';
import Productdetails from './pages/Productdetails.jsx';
import Footer from './components/Footer.jsx';
import SecureRoute from './services/SecureRoute.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import NosotrasPage from './pages/Nosotras.jsx';
import Location from './pages/Location.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import HelpCenter from './pages/HelpCenter.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';

// --- IMPORTACIONES DEL PANEL DE ADMIN ---
import SecureAdminRoute from './services/SecureAdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

import './App.css';

function App() {
  const location = useLocation();
  
  // Detectamos si estamos en una ruta de admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Renderizado condicional de la barra de navegación */}
      {isAdminRoute ? <NavbarAdmin /> : <NavBar />}

      <Routes>
        {/* ================= RUTAS DE CLIENTES ================= */}
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        
        <Route path='/addtocart' element={<SecureRoute/>}>
          <Route path='' element={<Addtocart/>}/>
        </Route>

        <Route path='/category/:categoryName' element={<CategoryPage/>} />
        <Route path='/searchedproduct' element={<Searchedproduct/>} />
        <Route path='/productdetails/:id' element={<Productdetails/>} />
        <Route path='/nosotras' element={<NosotrasPage/>} />
        <Route path='/location' element={<Location/>} />
        <Route path='/termsandconditions' element={<TermsAndConditions/>} />
        <Route path='/helpcenter' element={<HelpCenter/>} />
        <Route path='/privacypolicy' element={<PrivacyPolicy/>} />
        <Route path='/orden-confirmada' element={<OrderConfirmation/>} />

        {/* ================= RUTAS DE ADMINISTRACIÓN ================= */}
        <Route path='/admin' element={
          <SecureAdminRoute allowedRoles={['admin', 'empleado']}>
            <AdminDashboard/>
          </SecureAdminRoute>
        } />
        
        <Route path='/admin/products' element={
          <SecureAdminRoute allowedRoles={['admin', 'empleado']}>
            <AdminProducts/>
          </SecureAdminRoute>
        } />
        
        <Route path='/admin/orders' element={
          <SecureAdminRoute allowedRoles={['admin', 'empleado']}>
            <AdminOrders/>
          </SecureAdminRoute>
        } />
      </Routes>

      {/* Footer y WhatsApp solo se muestran en la tienda pública, no en admin */}
      {!isAdminRoute && <Footer/>}
      {!isAdminRoute && <WhatsAppButton/>}
    </>
  );
}

export default App;