import React from 'react'
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            alert('Logged out successfully');
            navigate('/');  // Redirect to login after logout
        } catch (error) {
            console.error('Error logging out', error);
        }
    };
    return (
        <>
            <div className='w-full bg-[rgb(0,128,128)] text-white text-xl font-serif'>
                <div className='flex justify-center items-center gap-10'>
                    <nav className='flex gap-10 items-center py-3'>
                        <Link to='/'>
                            <li className='list-none hover:cursor-pointer'>Login</li>
                        </Link>
                        <Link to='/registeruser'>
                            <li className='list-none hover:cursor-pointer'>Signup</li>
                        </Link>
                        <Link to=''>
                            <li className='list-none hover:cursor-pointer'><button onClick={handleLogout}>Logout</button></li>
                        </Link>
                    </nav>

                </div>
            </div>
        </>
    )
}

export default Navbar