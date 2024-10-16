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
        const response = await axios.get('http://localhost:3000/api/admin/images', {
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

    fetchImages();
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='bg-[rgb(173,97,25)] h-auto w-auto'>
      <h1 className='text-center text-2xl text-white'>Admin Dashboard</h1>
      <div className='border w-full h-full px-5'>
        <div className='h-auto border flex justify-between gap-x-20'>
          <div>Username</div>
          <div>Email</div>
          <div>Images</div>
          <div>Created At</div>
          <div>POCompletedAt</div>
          <div>AccountantcompletedAt</div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='flex justify-between pt-5'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img src={image.path} alt={image.filename} onDoubleClick={() => window.open(image.path, '_blank')} className='w-24 h-auto rounded-md' />
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


          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
