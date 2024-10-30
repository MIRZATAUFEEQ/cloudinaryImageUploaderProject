import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const PoAdminSignup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        adminRegistrationToken: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/registeruser`, formData);
            localStorage.setItem('token', response.data.token);  // Save token
            localStorage.setItem('email',formData.email)
            alert(` ${formData.username} as a PO, Signup successful!`);
            navigate('/podashboard');  // Redirect to image upload after signup
        } catch (error) {
            console.error('Error signing up as PO', error);
            alert(error.response?.data || 'Error signing up as PO');
        }
    };

    return (
        <>
            <div className='w-full h-screen bg-[rgb(1,1,1)] flex flex-col justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            className='outline-none'
                            placeholder='Enter your username'
                            onChange={handleChange}
                            autoComplete='username'
                        />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className='outline-none'
                            placeholder='Enter your email'
                            onChange={handleChange}
                            autoComplete='email'
                        />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            className='outline-none'
                            placeholder='Enter your password'
                            onChange={handleChange}
                            autoComplete='password'

                        />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input
                            type="password"
                            name="adminRegistrationToken"
                            value={formData.adminRegistrationToken}
                            className='outline-none'
                            placeholder='Enter secretKey'
                            onChange={handleChange}
                            autoComplete='adminRegistrationToken'

                        />
                    </div>
                    <div className='border text-center rounded-2xl bg-[rgb(0,128,128)] text-3xl p-1 text-white'>
                        <button type='submit'>
                            PO SignUp
                        </button>
                    </div>
                    <Link to='/pologin'>
                        <li className='list-none text-gray-500'>Login as a PO</li>
                    </Link>
                </form>
            </div>
        </ >
    )
}

export default PoAdminSignup