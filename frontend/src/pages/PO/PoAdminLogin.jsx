import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
const PoAdminLogin = () => {
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
            const { token, isAdmin } = response.data;

            if (isAdmin) {
                localStorage.setItem('token', token);  // Save token
                alert(`${formData.email} as a PO, Login successful!`);
                navigate('/podashboard');  // Redirect to image upload after login
            } else {
                alert('Access denied. You are not PO.');
            }
        } catch (error) {
            console.error('Error logging in as admin', error);
            alert(error.response?.data || 'Error logging in as PO');
        }
    };

    return (
        <>
            <div className='w-full h-screen bg-[rgb(1,1,1)] flex flex-col justify-center items-center'>
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
                    <div className='border text-center rounded-2xl bg-[rgb(0,128,128)] text-2xl p-1 text-white'>
                        <button type='submit'>
                            PO Login
                        </button>
                    </div>
                    <Link to='/posignup'>
                        <li className='list-none text-gray-500'>Don't have account</li>
                    </Link>
                </form>
            </div>
        </>
    );
};

export default PoAdminLogin;
