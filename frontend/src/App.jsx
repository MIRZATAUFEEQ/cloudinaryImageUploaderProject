import React from 'react'
import ImageUpload from './components/ImageUpload'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

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
            <Route exact path='/upload' element={
              <ProtectedRoute>
                <ImageUpload />
              </ProtectedRoute>
            } />
          </Routes>

        </BrowserRouter>
      </div>
    </>
  )
}

export default App