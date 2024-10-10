import React from 'react'
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <div className='w-full bg-[rgb(0,128,128)] '>
                <div className='flex justify-center items-center gap-10'>
                    <nav className='flex gap-10 items-center py-3'>
                        <Link to='/'>  <li className='list-none hover:cursor-pointer'>home</li></Link>
                        <Link to='/registeruser'>
                            <li className='list-none hover:cursor-pointer'>signup</li>
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