import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AccountantAdminLogin = () => {
    const [formData, setformData] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        e.preventDefault()
        setformData({ ...formData, [e.target.name]: e.target.value })
        // console.log(formData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3000/api/user/loginuser`, formData)
            const { token, isAdmin } = response.data
            if (isAdmin) {
                localStorage.setItem('token', token)
                alert(`${formData.email} accountant is login successfully`)
                navigate('/accountant/dashboard')
            } else {
                alert(`Access denied. ${formData.email} not Accountant`)
            }

        } catch (error) {
            alert(error.response?.data || 'error login as a accountant')
        }
    }
    return (
        <>
            {/* border text-center rounded-2xl bg-[rgb(171,84,37)] text-xl p-1 */}
            <div onSubmit={handleSubmit} className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
                <form className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input type="email" name="email" className='outline-none' value={formData.email} onChange={handleChange} placeholder='enter you email' />
                    </div>
                    <div className='border rounded-2xl p-2'><input type="password" value={formData.password} onChange={handleChange} autoComplete='curront-password' name="password" className='outline-none' placeholder='enter you password' /></div>
                    <div className='border rounded-2xl bg-[rgb(171,84,37)] text-xl p-2 text-center'>
                        <button>Accountant Login</button>
                    </div>
                    <Link to='/accountant/signup'>
                        <li className='list-none text-gray-500'>SignUp as a Accountant</li>
                    </Link>
                </form>
            </div>

        </>
    )
}

export default AccountantAdminLogin