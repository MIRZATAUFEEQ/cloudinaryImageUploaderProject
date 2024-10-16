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
      const POcompletedAt = new Date().toISOString();

      await axios.patch(`http://localhost:3000/api/admin/images/${imageId}`, {
        POstatus: 'Done',
        POcompletedAt: POcompletedAt
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Use your token logic here
        }
      });

      const newPOStatuses = [...POstatuses];
      newPOStatuses[index] = 'Done';
      setPOStatuses(newPOStatuses);

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
    <div className='bg-[rgb(173,97,25)] min-h-screen w-full'>
      <h1 className='text-center text-2xl text-white mb-4'>PO Dashboard</h1>
      <div className='w-full h-full px-5'>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b'>
          <div><h3 className='text-white'>Username</h3></div>
          <div><h3 className='text-white'>Email</h3></div>
          <div><h3 className='text-white'>Images</h3></div>
          <div><h3 className='text-white'>Created At</h3></div>
          <div><h3 className='text-white'>PO Completed At</h3></div>
          <div><h3 className='text-white'>PO Status</h3></div>
        </div>

        {images.map((image, index) => (
          <div key={image._id} className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b'>
            <div>{image.user.username}</div>
            <div>{image.user.email}</div>
            <div>
              <img
                src={image.path}
                alt={image.filename}
                onDoubleClick={() => window.open(image.path, '_blank')}
                className='w-24 h-auto rounded-md'
              />
            </div>
            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
            <div>
              {image.POcompletedAt
                ? new Date(image.POcompletedAt).toLocaleString()
                : 'Not Completed Yet'}
            </div>
            <button
              className={`border h-[2rem] px-6 rounded-xl bg-[rgb(173,97,25)] text-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${POstatuses[index] === 'Done' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleClick(index, image._id)}
              disabled={POstatuses[index] === 'Done'}
            >
              {POstatuses[index]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoAdminDashboard;
