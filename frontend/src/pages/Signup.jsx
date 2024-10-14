import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
const navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password } = formData;

        // Log user data to the console for debugging
        // console.log("User Data:", formData);

        try {
            // Send user data to the backend for registration
            const result = await axios.post('http://localhost:3000/api/user/registeruser', {
                username, email, password
            });
            // console.log(result.data);  // Success message in the console
            alert(`${formData.email} is successfully SignUp`)
navigate('/upload')
        } catch (error) {
            alert(`signup failed this user is already exists ${error}`)
            // console.error('Error registering user:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
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
