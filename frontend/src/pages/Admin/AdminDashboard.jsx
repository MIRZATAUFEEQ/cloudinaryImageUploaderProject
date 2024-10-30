import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <>
      <div className='w-full flex justify-center items-center text-black bg-[rgb(240,240,240)] sticky top-0 z-10'>
        <nav className='w-[40rem] h-[5rem] flex items-center justify-center gap-5 list-none text-lg bg-[rgb(240,240,240)]'>
          <Link to='podetail'><li>PO Details</li></Link>
          <Link to='grndetail'><li>GRN Details</li></Link>
          <Link to='accountantdetail'><li>Accountant Details</li></Link>
        </nav>
      </div>
      <Outlet />
    </>
  );
}

export default AdminDashboard;
