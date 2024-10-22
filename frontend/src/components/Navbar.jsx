import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // State for toggle

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem('token');
            alert('Logged out successfully');
            navigate('/'); // Redirect to login after logout
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <div className='w-full bg-[rgb(0,128,128)] text-white text-xl font-serif h-auto'>
            <div className='flex justify-between items-center py-3 px-4'>
                <button onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        {isOpen ? (
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                        ) : (
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7' />
                        )}
                    </svg>
                </button>
            </div>
            <nav className={`flex-col justify-center md:flex md:flex-row md:items-center md:gap-10 ${isOpen ? 'flex' : 'hidden'} md:flex`}>
                <Link to='/pologin'>
                    <li className='list-none hover:cursor-pointer'>POLogin</li>
                </Link>
                <Link to='/accountantlogin'>
                    <li className='list-none hover:cursor-pointer'>AccountantLogin</li>
                </Link>
                <Link to='/adminlogin'>
                    <li className='list-none hover:cursor-pointer'>AdminLogin</li>
                </Link>
                <Link to='/'>
                    <li className='list-none hover:cursor-pointer'>Login</li>
                </Link>
                <Link to='/registeruser'>
                    <li className='list-none hover:cursor-pointer'>Signup</li>
                </Link>
                <li className='list-none hover:cursor-pointer'>
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </nav>
        </div>
    );
};

export default Navbar;
