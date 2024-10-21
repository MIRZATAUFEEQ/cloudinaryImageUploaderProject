import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PoAdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [POstatuses, setPOStatuses] = useState([]);
  const [filter, setFilter] = useState({ POstatus: 'All' });


  useEffect(() => {
    const fetchImages = async () => {
      try {
        // First fetch all images
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Raw response data:', response.data);

        // Apply filtering based on selected filter
        let filteredImages;
        if (filter.POstatus === 'All') {
          filteredImages = response.data;
        } else if (filter.POstatus === 'Done') {
          filteredImages = response.data.filter(image => image.POstatus === 'Done');
        } else if (filter.POstatus === 'Pending') {
          filteredImages = response.data.filter(image => image.POstatus !== 'Done');
        }

        console.log('Filtered Images:', filteredImages);
        setImages(filteredImages);

        // Update statuses
        const newPOStatuses = filteredImages.map(image =>
          image.POstatus === 'Done' ? 'Done' : 'Pending'
        );
        setPOStatuses(newPOStatuses);

      } catch (err) {
        console.error('Error details:', err.response?.data || err.message);
        setError('Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [filter]);

  const handleClick = async (index, imageId) => {
    try {
      const POcompletedAt = new Date().toISOString();

      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`, {
        POstatus: 'Done',
        POcompletedAt,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (filter.POstatus === 'Pending') {
        // If we're in pending filter, remove the item
        setImages(prev => prev.filter((_, i) => i !== index));
        setPOStatuses(prev => prev.filter((_, i) => i !== index));
      } else {
        // Update the status
        const newPOStatuses = [...POstatuses];
        newPOStatuses[index] = 'Done';
        setPOStatuses(newPOStatuses);

        const updatedImages = [...images];
        updatedImages[index] = {
          ...updatedImages[index],
          POstatus: 'Done',
          POcompletedAt
        };
        setImages(updatedImages);
      }

    } catch (error) {
      console.error('Failed to update POstatus:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log('Filter changed:', { [name]: value });
    setFilter((prev) => ({ ...prev, [name]: value }));
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
    <div className='bg-[rgb(1,1,1)] min-h-screen w-full'>
      <h1 className='text-center text-3xl text-white mb-4 pt-4 font-bold font-serif'>PO Dashboard</h1>
      <div className='text-white px-7 py-5 font-serif'>ImageCount: <span className='border p-1 rounded'>{images.length}</span></div>
      <div className='py-5 px-5'>
        <label htmlFor="POstatus" className='px-2 text-white'>Filter by PO Status:</label>
        <select
          name="POstatus"
          value={filter.POstatus}
          onChange={handleFilterChange}
          className="rounded-md px-2 py-1"
        >
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className='w-full h-full px-5'>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b'>
          <div><h3 className='text-white'>Username</h3></div>
          <div><h3 className='text-white'>Email</h3></div>
          <div><h3 className='text-white'>Images</h3></div>
          <div><h3 className='text-white'>Created At</h3></div>
          <div><h3 className='text-white'>PO Completed At</h3></div>
          <div><h3 className='text-white'>PO Status</h3></div>
        </div>

        {images.length === 0 ? (
          <div className='text-white text-center py-4'>No images found for the selected filter.</div>
        ) : (
          images.map((image, index) => (
            <div key={image._id} className='grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b text-white'>
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
              <button
                className={`border h-[2rem] px-6 rounded-xl 
                  ${POstatuses[index] === 'Done'
                    ? 'bg-green-600 opacity-50 cursor-not-allowed'
                    : 'bg-[rgb(173,97,25)] hover:bg-[rgb(193,117,45)]'} 
                  text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                onClick={() => handleClick(index, image._id)}
                disabled={POstatuses[index] === 'Done'}
              >
                {POstatuses[index]}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default PoAdminDashboard;