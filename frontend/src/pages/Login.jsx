import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
    const [formData, setformData] = useState({ email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { email, password } = formData
        // console.log(formData)
        try {
            const result = await axios.post(`http://localhost:3000/api/user/loginuser`, {
                email,
                password,
            })
            // console.log(result.data)
            alert(`${formData.email} successfully logedIn`)
        } catch (error) {
            // console.log('user not found', error)
            alert(` login failed ${error}`)
        }
    }


    const handleChange = (e) => {
        e.preventDefault()
        setformData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
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
                            Login
                        </button>
                    </div>
                    <Link to='/registeruser'>
                        <li className='list-none text-gray-500'>Don't have account</li>
                    </Link>
                </form>
            </div>
        </>
    )
}

export default Login