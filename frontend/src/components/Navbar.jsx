import React from 'react'
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/user/logout', {}, {
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
            <div className='w-full bg-[rgb(0,128,128)] '>
                <div className='flex justify-center items-center gap-10'>
                    <nav className='flex gap-10 items-center py-3'>
                        <Link to='/'>
                            <li className='list-none hover:cursor-pointer'>login</li>
                        </Link>
                        <Link to='/registeruser'>
                            <li className='list-none hover:cursor-pointer'>signup</li>
                        </Link>
                        <Link to=''>
                            <li className='list-none hover:cursor-pointer'><button onClick={handleLogout}>Logout</button></li>
                        </Link>
                        <li className='list-none hover:cursor-pointer'>contact</li>
                    </nav>
                    <Link to='/profile'>
                        <div >
                            <CgProfile className='text-2xl' />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Navbar