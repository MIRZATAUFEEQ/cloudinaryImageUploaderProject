import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PoAdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [POstatuses, setPOStatuses] = useState([]);
  const [filter, setFilter] = useState({ POstatus: 'All' });
  const [formData, setFormData] = useState([]); // Initialize as an array

  // Fetch images when component mounts or filter changes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication failed. Token is missing.');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let filteredImages;
        if (filter.POstatus === 'All') {
          filteredImages = response.data;
        } else if (filter.POstatus === 'Done') {
          filteredImages = response.data.filter(image => image.POstatus === 'Done');
        } else if (filter.POstatus === 'Pending') {
          filteredImages = response.data.filter(image => image.POstatus !== 'Done');
        }

        setImages(filteredImages);

        // Initialize formData with PO numbers
        const initialFormData = filteredImages.map(image => ({
          POnumber: '', // Start with empty PO numbers
        }));
        setFormData(initialFormData);

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

  // Handle click to update PO status
  const handleClick = async (index, imageId) => {
    try {
      const POcompletedAt = new Date().toISOString();

      if (!formData[index]?.POnumber) {
        alert('Please enter a PO number before updating the status.');
        return;
      }
      const POemail = localStorage.getItem('email')
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`, {
        POstatus: 'Done',
        POcompletedAt,
        POnumber: formData[index].POnumber, // Use the specific PO number
        POemail: POemail
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (filter.POstatus === 'Pending') {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPOStatuses(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => prev.filter((_, i) => i !== index)); // Also remove the form data for this index
      } else {
        const newPOStatuses = [...POstatuses];
        newPOStatuses[index] = 'Done';
        setPOStatuses(newPOStatuses);

        const updatedImages = [...images];
        updatedImages[index] = {
          ...updatedImages[index],
          POstatus: 'Done',
          POcompletedAt,
          POnumber: formData[index].POnumber,
          POemail: POemail
        };
        setImages(updatedImages);
      }

    } catch (error) {
      console.error('Failed to update POstatus:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
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

  const handleChange = (index, e) => {
    const { value } = e.target;
    // Update the specific formData index for the current image
    setFormData(prev => {
      const newFormData = [...prev];
      newFormData[index] = { POnumber: value }; // Update only the corresponding POnumber
      return newFormData;
    });
  };


  const getMimeType = (fileExtension) => {
    switch (fileExtension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt':
        return 'text/plain';
      case 'csv':
        return 'text/csv';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'mp3':
        return 'audio/mpeg';
      case 'mp4':
        return 'video/mp4';
      default:
        return 'application/octet-stream'; // Generic type for unknown formats
    }
  };

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

      <div className='w-full h-full px-4'>
        <div id='header' className='sticky top-0 grid grid-cols-2 md:grid-cols-7 gap-4 py-5 border-b bg-[rgb(173,97,25)] z-10'>
          <div><h3 className='text-white'>Username</h3></div>
          <div><h3 className='text-white'>Email</h3></div>
          <div><h3 className='text-white'>Images</h3></div>
          <div><h3 className='text-white'>Created At</h3></div>
          <div><h3 className='text-white'>PO no.</h3></div>
          <div><h3 className='text-white'>PO Completed At</h3></div>
          <div><h3 className='text-white'>PO Status</h3></div>
        </div>

        {images.length === 0 ? (
          <div className='text-white text-center py-4'>No images found for the selected filter.</div>
        ) : (
          images.map((image, index) => (
            <div key={image._id} className='grid grid-cols-2 md:grid-cols-7 gap-4 py-5 border-b text-white'>
              <div>{image.user?.username || 'Username not found'}</div>
              <div>{image.user?.email || 'Email not found'}</div>
              <div>
                <img
                  src={image.path}
                  alt={image.filename}
                  onDoubleClick={() => {
                    // Check if the image path is a Buffer object
                    if (image.path && image.path.type === 'Buffer') {
                      // Get file extension from filename
                      const fileExtension = image.filename.split('.').pop();
                      
                      // Get the MIME type based on the file extension
                      const mimeType = getMimeType(fileExtension);
                
                      // Convert the buffer to a Blob and create a download link
                      const blob = new Blob([new Uint8Array(image.path.data)], { type: mimeType });
                      const blobUrl = URL.createObjectURL(blob);
                      
                      // Create a temporary anchor element to trigger the download
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = image.filename || 'file';
                      link.click(); // Trigger the download
                    } else if (typeof image.path === 'string') {
                      // Handle case where image.path is a valid URL
                      const fileUrl = image.path;
                      const link = document.createElement('a');
                      link.href = fileUrl;
                      link.download = image.filename || 'file';
                      link.click(); // Trigger the download
                    } else {
                      console.error('Invalid file URL:', image.path);
                      alert('Failed to download file. Invalid URL.');
                    }
                  }}
                  className='h-[3rem] w-[8rem] rounded-md cursor-pointer hover:opacity-80 transition-opacity'
                />
              </div>
              <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
              <div>
                <input
                  type="text"
                  name='POnumber'
                  onChange={(e) => handleChange(index, e)} // Pass index to handleChange
                  value={formData[index]?.POnumber || ''} // Use the specific POnumber
                  placeholder='enter PO no.'
                  className='w-[7rem] text-black outline-none px-1 rounded-md'
                />
              </div>
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
