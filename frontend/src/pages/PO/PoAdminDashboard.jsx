import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PoAdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/images', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
          }
        });
        setImages(response.data);

        // Initialize statuses array based on the status from the database
        const fetchedStatuses = response.data.map(image => image.status === 'Done' ? 'Done' : 'Pending');
        setStatuses(fetchedStatuses);
      } catch (err) {
        setError('Failed to fetch images');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleClick = async (index, imageId) => {
    try {
      // Get the current date and time
      const completedAt = new Date().toISOString();

      // Update status in the backend
      await axios.patch(`http://localhost:3000/api/admin/images/${imageId}`, {
        status: 'Done',
        completedAt: completedAt
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
        }
      });

      // Update status in the frontend
      const newStatuses = [...statuses];
      newStatuses[index] = 'Done';
      setStatuses(newStatuses);

      // Optionally update the completedAt in the images array for the clicked image
      const updatedImages = [...images];
      updatedImages[index].completedAt = completedAt;
      setImages(updatedImages);

    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='bg-[rgb(173,97,25)] h-auto w-auto'>
      <h1 className='text-center text-2xl text-white'>PO Dashboard</h1>
      <div className='border w-full h-full'>
        <div className='h-auto border flex justify-center gap-x-40'>
          <div>Username</div>
          <div>Email</div>
          <div>Images</div>
          <div>Created At</div>
          <div>Completed At</div>
          <div>Status</div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='flex justify-center gap-x-24 pt-5'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img src={image.path} alt={image.filename} className='w-24 h-auto rounded-md' />
            </div>
            {/* Format and display the createdAt date */}
            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
            <div>
              {image.completedAt
                ? new Date(image.completedAt).toLocaleString()
                : 'Not Completed Yet'}
            </div>
            <button
              className='border h-[2rem] px-6 rounded-xl bg-[rgb(173,97,25)] text-white shadow-lg hover:shadow-xl transition-shadow duration-300'
              onClick={() => handleClick(index, image._id)} // Pass the index and image ID to handleClick
            >
              {statuses[index]} {/* Display the corresponding status */}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PoAdminDashboard;
