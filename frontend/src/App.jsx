import React from 'react'
import ImageUpload from './components/ImageUpload'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Login from './pages/Login'
// import ProtectedRoute from './components/ProtectedRoute'
import PrivateRoute from './pages/PrivateRoute'
import AdminSignup from './pages/Admin/AdminSignup'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashbord from './pages/Admin/AdminDashboard';
import Logout from '../../Backend/models/userlogou.models'



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
            {/* admin route  */}
            <Route exact path='/adminsignup' element={<AdminSignup />} />
            <Route exact path='/adminlogin' element={<AdminLogin />} />
            <Route exact path='/adminDashbord' element={<AdminDashbord />} />


          </Routes>

        </BrowserRouter>
      </div>
    </>
  )
}

export default App