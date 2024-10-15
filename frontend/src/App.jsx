import React from 'react'
import ImageUpload from './components/ImageUpload'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Login from './pages/Login'
// import ProtectedRoute from './components/ProtectedRoute'
import PrivateRoute from './pages/PrivateRoute'
import PoAdminSignup from './pages/PO/PoAdminSignup'
import PoAdminLogin from './pages/PO/PoAdminLogin'
import PoAdminDashbord from './pages/PO/PoAdminDashboard';
import AccountantAdminSignup from './pages/Accountant/AccountantAdminSignup'
import AccountantAdminLogin from './pages/Accountant/AccountantAdminLogin'
import AccountantAdminDashboard from './pages/Accountant/AccountantAdminDashboard'
import AdminSignup from './pages/Admin/AdminSignup'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'


const App = () => {
  return (
    <>
      <div className='bg-[rgb(173,97,25)] w-full h-screen'>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path='/registeruser' element={<Signup />} />
            <Route exact path='/' element={<Login />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route path="/upload" element={<PrivateRoute><ImageUpload /></PrivateRoute>} />
            {/*PO admin route  */}
            <Route exact path='/po/signup' element={<PoAdminSignup />} />
            <Route exact path='/po/login' element={<PoAdminLogin />} />
            <Route exact path='/po/dashboard' element={<PoAdminDashbord />} />
            <Route exact path='/accountant/signup' element={<AccountantAdminSignup />} />
            <Route exact path='/accountant/login' element={<AccountantAdminLogin />} />
            <Route exact path='/accountant/dashboard' element={<AccountantAdminDashboard />} />
            <Route exact path='/admin/signup' element={<AdminSignup />} />
            <Route exact path='/admin/login' element={<AdminLogin />} />
            <Route exact path='/admin/dashboard' element={<AdminDashboard />} />

          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App