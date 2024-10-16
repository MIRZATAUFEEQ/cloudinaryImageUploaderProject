import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AccountantAdminSignup = () => {
    const navigate = useNavigate()
    const [formData, setformData] = useState({
        username: '',
        email: '',
        password: '',
        adminRegistrationToken: '',
    })

    const handleChange = (e) => {
        // e.preventDefault()
        setformData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3000/api/user/registeruser`, formData)
            localStorage.setItem('token', response.data.token)
            alert(`${formData.username} accountant signup successfully`)
            navigate('/accountant/dashboard')

        } catch (error) {
            alert(error.response?.data || 'Error signup as a admin')
        }
    }

    return (
        <>
            <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder='enter your username' className='outline-none' />
                    </div>

                    <div className='border rounded-2xl p-2'>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='enter your email' className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" name="password" autoComplete='curront-password' value={formData.password} onChange={handleChange} placeholder='enter your password' className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" name="adminRegistrationToken" value={formData.adminRegistrationToken} onChange={handleChange} placeholder='enter your adminRegistrationToken' className='outline-none' />
                    </div>
                    <div className='border text-center rounded-2xl bg-[rgb(171,84,37)] text-xl p-1'>
                        <button type='submit'>
                            Accountant SignUp
                        </button>
                    </div>
                    <Link to='/accountant/login'>
                        <li className='list-none text-gray-500'>login as a Accountant</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default AccountantAdminSignup