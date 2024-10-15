import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PoAdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [POstatuses, setPOStatuses] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/images', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
          }
        });
        setImages(response.data);

        // Initialize POstatuses array based on the POstatus from the database
        const fetchedPOStatuses = response.data.map(image => image.POstatus === 'Done' ? 'Done' : 'Pending');
        setPOStatuses(fetchedPOStatuses);
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
      const POcompletedAt = new Date().toISOString();

      // Update POstatus in the backend
      await axios.patch(`http://localhost:3000/api/admin/images/${imageId}`, {
        POstatus: 'Done',
        POcompletedAt: POcompletedAt
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
        }
      });

      // Update POstatus in the frontend
      const newPOStatuses = [...POstatuses];
      newPOStatuses[index] = 'Done';
      setPOStatuses(newPOStatuses);

      // Optionally update the POcompletedAt in the images array for the clicked image
      const updatedImages = [...images];
      updatedImages[index].POcompletedAt = POcompletedAt;
      setImages(updatedImages);

    } catch (error) {
      console.error('Failed to update POstatus', error);
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
          <div>POCompletedAt</div>
          <div>POStatus</div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='flex justify-center gap-x-24 pt-5'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img src={image.path} alt={image.filename} onDoubleClick={() => window.open(image.path, '_blank')} className='w-24 h-auto rounded-md' />
            </div>
            {/* Format and display the createdAt date */}
            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
            <div>
              {image.POcompletedAt
                ? new Date(image.POcompletedAt).toLocaleString()
                : 'Not Completed Yet'}
            </div>
            <button
              className={`border h-[2rem] px-6 rounded-xl bg-[rgb(173,97,25)] text-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${POstatuses[index] === 'Done' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleClick(index, image._id)} // Pass the index and image ID to handleClick
              disabled={POstatuses[index] === 'Done'} // Disable the button if POstatus is 'Done'
            >
              {POstatuses[index]} {/* Display the corresponding POstatus */}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PoAdminDashboard;
