import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountantAdminDashboard = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accountantStatuses, setAccountantStatuses] = useState([]);
    const [filter, setFilter] = useState({ Accountantstatus: 'All' });
    const [stampstatus, setstampstatus] = useState({})

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
                const newStampStatus = filteredImages.reduce((acc, image) => {
                    acc[image._id] = image.stamp || false; // Set the checkbox based on the fetched 'stamp' field
                    return acc;
                }, {});
                setstampstatus(newStampStatus);

            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setError('Failed to fetch images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();

    }, [filter]);

    const handleAccountantClick = async (index, imageId) => {
        try {
            const AccountantcompletedAt = new Date().toISOString();
            const stamp = stampstatus[imageId]
            if (!stamp) {
                alert('please check on checkbox before updating your status')
                return
            }
            const Accountantemail = localStorage.getItem('email')
            await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`, {
                Accountantstatus: 'Done',
                AccountantcompletedAt,
                stamp: stamp,
                Accountantemail: Accountantemail
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(stamp)
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
                    AccountantcompletedAt,
                    stamp: stamp,
                    Accountantemail: Accountantemail
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

    const handleChange = (imageId) => {
        setstampstatus(prev => ({
            ...prev,
            [imageId]: !prev[imageId] // Toggle the stamp state
        }));
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
            <h1 className='text-center text-3xl text-white mb-4 pt-4 font-bold font-serif'>Accountant Dashboard</h1>
            <div className='text-white px-7 py-5 font-serif'>ImageCount: <span className='border p-1 rounded'>{images.length}</span></div>
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

            <div className='w-full h-full px-4'>
                <div className='sticky top-0 grid grid-cols-2 md:grid-cols-8 gap-4 py-5 border-b bg-[rgb(173,97,25)] z-10'>
                    <div><h3 className='text-white'>Username</h3></div>
                    <div><h3 className='text-white'>Email</h3></div>
                    <div><h3 className='text-white'>Images</h3></div>
                    <div><h3 className='text-white'>Created At</h3></div>
                    <div><h3 className='text-white'>GRN no.</h3></div>
                    <div><h3 className='text-white'>Verify</h3></div>
                    <div><h3 className='text-white'>Accountant Completed At</h3></div>
                    <div><h3 className='text-white'>Accountant Status</h3></div>
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
                                    className='h-[3rem] w-[8rem] cursor-pointer hover:opacity-80 transition-opacity'
                                />

                            </div>
                            <div>{image.createdAt ? new Date(image.createdAt).toLocaleString() : 'N/A'}</div>
                            <div>
                                {image.GRNnumber}
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="stamp"
                                    checked={stampstatus[image._id] || false} // Correctly set the checked state
                                    onChange={(e) => handleChange(image._id)}
                                /> <span>Stamp</span>

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
