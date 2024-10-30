import React from 'react'
import ImageUpload from './components/ImageUpload'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
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
import GrnSignup from './pages/GRN/GrnSignup'
import GrnLogin from './pages/GRN/GrnLogin'
import GrnDashboard from './pages/GRN/GrnDashboard'
import POdetails from './pages/Admin/Employdetails/POdetails'
import GRNdetails from './pages/Admin/Employdetails/GRNdetails'
import Accountantdetails from './pages/Admin/Employdetails/Accountantdetails'


const App = () => {
  return (
    <>
      <div className='bg-[rgb(1,1,1)] w-full h-screen font-serif'>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path='/registeruser' element={<Signup />} />
            <Route exact path='/' element={<Login />} />
            <Route path="/upload" element={<PrivateRoute><ImageUpload /></PrivateRoute>} />
            {/*PO admin route  */}
            <Route exact path='/posignup' element={<PoAdminSignup />} />
            <Route exact path='/pologin' element={<PoAdminLogin />} />
            <Route exact path='/podashboard' element={<PoAdminDashbord />} />

            {/* GRN route  */}
            <Route exact path='/grnsignup' element={<GrnSignup />} />
            <Route exact path='/grnlogin' element={<GrnLogin />} />
            <Route exact path='/grndashboard' element={<GrnDashboard />} />

            <Route exact path='/accountantsignup' element={<AccountantAdminSignup />} />
            <Route exact path='/accountantlogin' element={<AccountantAdminLogin />} />
            <Route exact path='/accountantdashboard' element={<AccountantAdminDashboard />} />

            <Route exact path='/adminsignup' element={<AdminSignup />} />
            <Route exact path='/adminlogin' element={<AdminLogin />} />
            <Route exact path='/admindashboard' element={<AdminDashboard />}>
            <Route exact path='podetail' element={<POdetails/>}/>
            <Route exact path='grndetail' element={<GRNdetails/>} />
            <Route exact path='accountantdetail' element={<Accountantdetails/>} />
            </Route>

          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App