import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const [formData, setformData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value })
        console.log(formData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/loginuser`, formData)
            const { token, isAdmin } = response.data

            if (isAdmin) {
                localStorage.setItem('token', token)
                alert('admin login successfully')
                navigate('/admindashboard')
            }
            else {
                console.log('Access denied, you are not admin')
            }
        } catch (error) {
            // alert(error.response?.data || 'Error logging in as admin');
            alert(error.response?.data || 'error logging as admin')
        }

    }

    return (
        <>
            <div className='w-full h-screen bg-[rgb(1,1,1)] flex flex-col justify-center items-center'>
                <form action="" onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input type="email" placeholder='enter your email' onChange={handleChange} value={formData.email} name="email" className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" placeholder='enter your password' onChange={handleChange} value={formData.password} name="password" className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2 text-center bg-[rgb(0,128,128)] text-2xl'>
                        <button type='submit'>AdminLogin</button>
                    </div>
                    <Link to='/adminsignup'>
                        <li className='list-none'>Signup as a admin</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default AdminLogin