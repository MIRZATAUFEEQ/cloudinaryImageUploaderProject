import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountantAdminDashboard = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accountantStatuses, setAccountantStatuses] = useState([]);
    const [filter, setFilter] = useState({ Accountantstatus: 'All' });

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch all images
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });


                // Apply filtering based on selected filter
                let filteredImages;
                if (filter.Accountantstatus === 'All') {
                    filteredImages = response.data;
                } else if (filter.Accountantstatus === 'Done') {
                    filteredImages = response.data.filter(image => image.Accountantstatus === 'Done');
                } else if (filter.Accountantstatus === 'Pending') {
                    filteredImages = response.data.filter(image => image.Accountantstatus !== 'Done');
                }

                setImages(filteredImages);

                // Update statuses
                const newAccountantStatuses = filteredImages.map(image =>
                    image.Accountantstatus === 'Done' ? 'Done' : 'Pending'
                );
                setAccountantStatuses(newAccountantStatuses);

            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setError('Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };
        setInterval(() => {
            fetchImages();
        }, 2000);

    }, [filter]);

    const handleAccountantClick = async (index, imageId) => {
        try {
            const AccountantcompletedAt = new Date().toISOString();

            await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`, {
                Accountantstatus: 'Done',
                AccountantcompletedAt,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (filter.Accountantstatus === 'Pending') {
                // If we're in pending filter, remove the item
                setImages(prev => prev.filter((_, i) => i !== index));
                setAccountantStatuses(prev => prev.filter((_, i) => i !== index));
            } else {
                // Update the status
                const newAccountantStatuses = [...accountantStatuses];
                newAccountantStatuses[index] = 'Done';
                setAccountantStatuses(newAccountantStatuses);

                const updatedImages = [...images];
                updatedImages[index] = {
                    ...updatedImages[index],
                    Accountantstatus: 'Done',
                    AccountantcompletedAt
                };
                setImages(updatedImages);
            }

        } catch (error) {
            console.error('Failed to update AccountantStatus:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log('Filter changed:', { [name]: value });
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-4">
            {error}
        </div>
    );

    return (
        <div className='bg-[rgb(173,97,25)] min-h-screen w-full'>
            <h1 className='text-center text-2xl text-white mb-4 pt-4'>Accountant Dashboard</h1>

            <div className='py-5 px-5'>
                <label htmlFor="Accountantstatus" className='px-2 text-white'>Filter by Status:</label>
                <select
                    name="Accountantstatus"
                    value={filter.Accountantstatus}
                    onChange={handleFilterChange}
                    className="rounded-md px-2 py-1"
                >
                    <option value="All">All</option>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className='w-full h-full px-5'>
                <div className='grid grid-cols-2 md:grid-cols-7 gap-4 py-5 border-b'>
                    <div><h3 className='text-white'>Username</h3></div>
                    <div><h3 className='text-white'>Email</h3></div>
                    <div><h3 className='text-white'>Images</h3></div>
                    <div><h3 className='text-white'>Created At</h3></div>
                    <div><h3 className='text-white'>PO Completed At</h3></div>
                    <div><h3 className='text-white'>Accountant Completed At</h3></div>
                    <div><h3 className='text-white'>Accountant Status</h3></div>
                </div>

                {images.length === 0 ? (
                    <div className='text-white text-center py-4'>No images found for the selected filter.</div>
                ) : (
                    images.map((image, index) => (
                        <div key={image._id} className='grid grid-cols-2 md:grid-cols-7 gap-4 py-5 border-b text-white'>
                            <div>{image.user.username}</div>
                            <div>{image.user.email}</div>
                            <div>
                                <img
                                    src={image.path}
                                    alt={image.filename}
                                    onDoubleClick={() => window.open(image.path, '_blank')}
                                    className='w-24 h-auto rounded-md cursor-pointer hover:opacity-80 transition-opacity'
                                />
                            </div>
                            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
                            <div>
                                {image.POcompletedAt
                                    ? new Date(image.POcompletedAt).toLocaleString()
                                    : 'Not Completed Yet'}
                            </div>
                            <div>
                                {image.AccountantcompletedAt
                                    ? new Date(image.AccountantcompletedAt).toLocaleString()
                                    : 'Not Completed Yet'}
                            </div>
                            <button
                                className={`border h-[2rem] px-6 rounded-xl 
                                    ${accountantStatuses[index] === 'Done'
                                        ? 'bg-green-600 opacity-50 cursor-not-allowed'
                                        : 'bg-[rgb(173,97,25)] hover:bg-[rgb(193,117,45)]'} 
                                    text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                onClick={() => handleAccountantClick(index, image._id)}
                                disabled={accountantStatuses[index] === 'Done'}
                            >
                                {accountantStatuses[index]}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AccountantAdminDashboard;