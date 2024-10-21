import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminSignup = () => {
    const [formData, setformData] = useState({
        username: '',
        email: '',
        password: '',
        adminRegistrationToken: '',
    })
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/registeruser`, formData)
            localStorage.setItem('token', response.data.token)
            alert(`${formData.username} Admin signup successfully`)
            navigate('/admindashboard')
        } catch (error) {

            alert(error.response?.data || 'error signing up as a admin')
        }
    }

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value })
        console.log(formData)
    }

    return (
        <>
            <div className='w-full h-screen bg-[rgb(1,1,1)] flex flex-col justify-center items-center'>
                <form action="" onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input type="text" placeholder='enter your username' onChange={handleChange} value={formData.username} name="username" className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="email" placeholder='enter your email' onChange={handleChange} value={formData.email} name="email" className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" placeholder='enter your password' onChange={handleChange} value={formData.password} name="password" className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" placeholder='enter your adminRegistrationToken' onChange={handleChange} value={formData.adminRegistrationToken} name="adminRegistrationToken" className='outline-none' />
                    </div>
                    <div className='border text-center rounded-2xl bg-[rgb(0,128,128)] text-2xl p-1'>
                        <button type='submit'>AdminSignup</button>
                    </div>
                    <Link to='/adminlogin'>
                        <li className='list-none text-gray-500'>Login as a admin</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default AdminSignup