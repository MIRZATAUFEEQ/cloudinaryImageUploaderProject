import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statuses, setStatuses] = useState([]); // Store statuses for each button

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/images', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
          }
        });
        setImages(response.data);
        // Initialize statuses array with 'Mark As Done' for each image
        setStatuses(Array(response.data.length).fill('Mark As Done'));
      } catch (err) {
        setError('Failed to fetch images');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleClick = (index) => {
    // Update the status for the clicked button to "Done"
    const newStatuses = [...statuses];
    newStatuses[index] = 'Done';
    setStatuses(newStatuses);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='bg-[rgb(173,97,25)] h-auto w-auto'>
      <h1 className='text-center'>Admin Dashboard</h1>
      <div className='border w-full h-full'>
        <div className='h-auto border flex justify-center gap-x-52'>
          <div>Username</div>
          <div>Email</div>
          <div>Images</div>
          <div>Date</div>
          <div>Status</div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='flex justify-center gap-x-32 pt-5'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img src={image.path} alt={image.filename} className='w-24 h-auto rounded-md' />
            </div>
            <div>{new Date(image.createdAt).toLocaleString()}</div>
            <button
              className='border h-[2rem] px-6 rounded-xl bg-[rgb(173,97,25)] text-white'
              onClick={() => handleClick(index)} // Pass the index to handleClick
            >
              {statuses[index]} {/* Display the corresponding status */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
