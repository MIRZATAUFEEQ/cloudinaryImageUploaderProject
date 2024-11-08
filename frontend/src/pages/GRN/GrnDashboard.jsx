import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GrnDashboard = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [GRNStatuses, setGRNStatuses] = useState([]);
    const [filter, setFilter] = useState({ GRNstatus: 'All' }); // Updated filter state
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication failed. Token is missing.');
                    return;
                }

                // Fetch all images
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response.data);

                // Ensure response.data is an array
                if (!Array.isArray(response.data)) {
                    setError('Unexpected response format');
                    return;
                }

                // Apply filtering based on selected filter
                let filteredImages;
                if (filter.GRNstatus === 'All') {
                    filteredImages = response.data;
                } else if (filter.GRNstatus === 'Done') {
                    filteredImages = response.data.filter(image => image.GRNstatus === 'Done');
                } else if (filter.GRNstatus === 'Pending') {
                    filteredImages = response.data.filter(image => image.GRNstatus !== 'Done');
                }

                setImages(filteredImages);

                // Initialize formData for GRNnumber
                const initialFormData = filteredImages.map(image => ({
                    GRNnumber: '', // Assuming it's empty by default
                }));
                setFormData(initialFormData);

                // Update GRN statuses
                const newGRNStatuses = filteredImages.map(image =>
                    image.GRNstatus === 'Done' ? 'Done' : 'Pending'
                );
                setGRNStatuses(newGRNStatuses);

            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setError('Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();

    }, [filter]);

    const handleGRNClick = async (index, imageId) => {
        try {
            const GRNcompletedAt = new Date().toISOString();

            if (!formData[index]?.GRNnumber) {
                alert('Please enter GRN number before updating the status.');
                return;
            }

            const GRNemail=localStorage.getItem('email')
            await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`, {
                GRNstatus: 'Done',
                GRNcompletedAt,
                GRNnumber: formData[index].GRNnumber,
                GRNemail:GRNemail
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (filter.GRNstatus === 'Pending') {
                // If we're in pending filter, remove the item
                setImages(prev => prev.filter((_, i) => i !== index));
                setGRNStatuses(prev => prev.filter((_, i) => i !== index));
                setFormData(prev => prev.filter((_, i) => i !== index));
            } else {
                // Update the status
                const newGRNStatuses = [...GRNStatuses];
                newGRNStatuses[index] = 'Done';
                setGRNStatuses(newGRNStatuses);

                const updatedImages = [...images];
                updatedImages[index] = {
                    ...updatedImages[index],
                    GRNstatus: 'Done',
                    GRNcompletedAt,
                    GRNnumber: formData[index].GRNnumber,
                    GRNemail:GRNemail
                };
                setImages(updatedImages);
            }

        } catch (error) {
            console.error('Failed to update GRNStatus:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log('Filter changed:', { [name]: value });
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (index, e) => {
        const { value } = e.target;
        // Update the specific formData index for the current image
        setFormData(prev => {
            const newFormData = [...prev];
            newFormData[index] = { GRNnumber: value }; // Update only the corresponding GRNnumber
            return newFormData;
        });
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
            <h1 className='text-center text-3xl text-white mb-4 pt-4 font-bold font-serif'>GRN Dashboard</h1>
            <div className='text-white px-7 py-5 font-serif'>ImageCount: <span className='border p-1 rounded'>{images.length}</span></div>
            <div className='py-5 px-5'>
                <label htmlFor="FilterBystatus" className='px-2 text-white'>Filter by Status:</label>
                <select
                    name="GRNstatus"
                    value={filter.GRNstatus}
                    onChange={handleFilterChange}
                    className="rounded-md px-2 py-1"
                >
                    <option value="All">All</option>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className='w-full h-full px-4'>
                <div id='header' className='sticky top-0 grid grid-cols-2 md:grid-cols-8 gap-4 py-5 border-b bg-[rgb(173,97,25)] z-10'>
                    <div><h3 className='text-white'>Username</h3></div>
                    <div><h3 className='text-white'>Email</h3></div>
                    <div><h3 className='text-white'>Images</h3></div>
                    <div><h3 className='text-white'>Created At</h3></div>
                    <div><h3 className='text-white'>PO no.</h3></div>
                    <div><h3 className='text-white'>GRN no.</h3></div>
                    <div><h3 className='text-white'>GRN CompletedAt</h3></div>
                    <div><h3 className='text-white'>GRN Status</h3></div>
                </div>

                {images.length === 0 ? (
                    <div className='text-white text-center py-4'>No images found for the selected filter.</div>
                ) : (
                    images.map((image, index) => (
                        <div key={image._id} className='grid grid-cols-2 md:grid-cols-8 gap-4 py-5 border-b text-white'>
                            <div>{image.user?.username || 'Unknown User'}</div> {/* Added null check */}
                            <div>{image.user?.email || 'Unknown Email'}</div>  {/* Added null check */}
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
                            <div>{image.POnumber}</div>
                            <div>
                                <input
                                    type="text"
                                    name="GRNnumber"
                                    onChange={(e) => handleChange(index, e)}  // Pass index here
                                    placeholder='enter GRN no.'
                                    className='w-[7rem] text-black outline-none px-1 rounded-md'
                                />
                            </div>
                            <div>
                                {image.GRNcompletedAt ? new Date(image.GRNcompletedAt).toLocaleString() : 'Not Completed Yet'}
                            </div>
                            <button
                                className={`border h-[2rem] px-6 rounded-xl 
                                    ${GRNStatuses[index] === 'Done'
                                        ? 'bg-green-600 opacity-50 cursor-not-allowed'
                                        : 'bg-[rgb(173,97,25)] hover:bg-[rgb(193,117,45)]'} 
                                    text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                onClick={() => handleGRNClick(index, image._id)}
                                disabled={GRNStatuses[index] === 'Done'}
                            >
                                {GRNStatuses[index]}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GrnDashboard;
