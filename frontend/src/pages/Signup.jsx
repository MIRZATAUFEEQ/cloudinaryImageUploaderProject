import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/registeruser`, formData);
            localStorage.setItem('token', response.data.token);  // Save token
            console.log(response.data)
            alert(`${formData.username} SignUp Successfully`)
            navigate('/upload');  // Redirect to image upload after signup
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    return (
        <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
            <form encType="multipart/form-data" onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
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
                <div className='border text-center rounded-2xl bg-[rgb(171,84,37)] text-3xl p-1'>
                    <button type='submit'>
                        SignUp
                    </button>
                </div>
                <Link to='/'>
                    <li className='list-none text-gray-500'>I have already a account</li>
                </Link>
            </form>
        </div>
    );
};

export default Signup;
