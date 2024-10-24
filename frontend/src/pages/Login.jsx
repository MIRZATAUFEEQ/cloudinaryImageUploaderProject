import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/loginuser`, formData);
            localStorage.setItem('token', response.data.token);  // Save token
            alert(`${formData.email} Login Successfully`);
            console.log(response)
            navigate('/upload');  // Redirect to image upload after login
        } catch (error) {
            alert(`please register`)
            navigate('registeruser')
            console.error('Error logging in', error);
        }
    };


    return (
        <>
            <div className='w-full h-screen bg-[rgb(1,1,1)] flex flex-col justify-center items-center'>
                <form encType="multipart/form-data" onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
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
                    <div className='border text-center rounded-2xl bg-[rgb(0,128,128)] text-3xl p-1 text-white'>
                        <button type='submit'>
                            Login
                        </button>
                    </div>
                    <Link to='/registeruser'>
                        <li className='list-none text-gray-500'>SignUp as a User</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default Login