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
            const response = await axios.post(`http://localhost:3000/api/user/registeruser`, formData)
            localStorage.setItem('token', response.data.token)
            alert(`${formData.username} Admin signup successfully`)
            navigate('/admin/dashboard')
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
            {/* className='border text-center rounded-2xl bg-[rgb(171,84,37)] text-3xl p-1' */}
            <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
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
                    <div className='border text-center rounded-2xl bg-[rgb(171,84,37)] text-2xl p-1'>
                        <button type='submit'>AdminSignup</button>
                    </div>
                    <Link to='/admin/login'>
                        <li className='list-none text-gray-500'>Login as a admin</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default AdminSignup