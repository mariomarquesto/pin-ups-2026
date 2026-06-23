import NavBar from './components/Header.jsx';
import {Routes, Route} from 'react-router-dom';
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
import './App.css';




function App() {

  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/addtocart' element={<SecureRoute/>}>
        <Route path='/addtocart' element={<Addtocart/>}/>
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
    </Routes>
    <Footer/>
    <WhatsAppButton/>
    </>
  )
}

export default App;
