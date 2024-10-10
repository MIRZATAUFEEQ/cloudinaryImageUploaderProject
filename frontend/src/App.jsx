import React from 'react'
import ImageUpload from './components/ImageUpload'
import Signup from './pages/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <div className='bg-[rgb(173,97,25)] w-full h-screen'>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<ImageUpload />} />
            <Route exact path='/registeruser' element={<Signup />} />
            <Route exact path='/loginuser' element={<Login />} />
            <Route exact path='/profile' element={<Profile />} />
          </Routes>

        </BrowserRouter>
      </div>
    </>
  )
}

export default App