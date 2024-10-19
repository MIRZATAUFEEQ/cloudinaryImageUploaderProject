import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [POstatuses, setPOStatuses] = useState([]);
  const [accountantStatuses, setAccountantStatuses] = useState([]); // New state for AccountantStatus
  const [accountantCompletedAt, setAccountantCompletedAt] = useState([]); // New state for AccountantCompletedAt

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
          }
        });
        setImages(response.data);

        // Initialize POstatuses and accountantStatuses array based on the data from the database
        // const fetchedPOStatuses = response.data.map(image => image.POstatus === 'Done' ? 'Done' : 'Pending');
        const fetchedAccountantStatuses = response.data.map(image => image.Accountantstatus === 'Done' ? 'Done' : 'Pending');
        const fetchedAccountantCompletedAt = response.data.map(image => image.AccountantcompletedAt || null);

        // setPOStatuses(fetchedPOStatuses);
        setAccountantStatuses(fetchedAccountantStatuses);
        setAccountantCompletedAt(fetchedAccountantCompletedAt);
      } catch (err) {
        setError('Failed to fetch images');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    setInterval(() => {
      fetchImages();
    }, 2000);
  }, []);


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
      <h1 className='text-center text-2xl text-white mb-4'>Admin Dashboard</h1>
      <div className='w-full h-full px-5'>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b'>
          <div>Username</div>
          <div>Email</div>
          <div>Images</div>
          <div>Created At</div>
          <div>POtimeTaken</div>
          <div>AccountantTimeTaken</div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img src={image.path} alt={image.filename} onDoubleClick={() => window.open(image.path, '_blank')} className='h-[3rem] w-[4rem] rounded-md ' />
            </div>
            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>

            <div>{image.POtimeTaken ? `${image.POtimeTaken} minute` : 'Not Available'}</div>

            <div>
              {image.AccountantTimeTaken ? `${image.AccountantTimeTaken} minute` : 'Not Available'}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
