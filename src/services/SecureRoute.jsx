import { Outlet, Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/session'

const SecureRoute = () => {
  return isLoggedIn() ? <Outlet/> : <Navigate to={"/login"}/>
}

export default SecureRoute