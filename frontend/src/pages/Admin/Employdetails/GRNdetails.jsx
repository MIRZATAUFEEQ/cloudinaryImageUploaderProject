import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GRNdetails = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/images`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use your token logic here
                        },
                    }
                );
                setImages(response.data);


            } catch (err) {
                setError('Failed to fetch images');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );

    if (error)
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );

    // Image status counting
    const GRNDone = images.filter((image) => image.POstatus === 'Done').length;
    const GRNPending = images.length - GRNDone;

    return (
        <div className="bg-[rgb(1,1,1)] min-h-screen w-full text-white mt-10">
            <h1 className="text-center text-3xl text-white mb-4 font-bold font-serif">
                Admin Dashboard
            </h1>
            {/* Image count */}
            <div className="flex justify-between px-4 font-serif">
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="bg-[rgb(142,39,39)] border rounded-lg py-2 px-1">
                            GRN Pending Task:
                        </span>
                        <span className="border px-2 py-1 mx-2 rounded bg-[rgb(117,34,34)]">
                            {GRNPending}
                        </span>
                    </div>
                    <div>
                        <span className="bg-[rgb(11,82,37)] border rounded-lg py-2 px-1">
                            GRN Done Task:
                        </span>
                        <span className="border px-2 py-1 mx-6 rounded bg-[rgb(11,82,37)]">
                            {GRNDone}
                        </span>
                    </div>
                </div>
        
            </div>

            <div className="text-white px-7 py-5 text-center">
                <span className="font-serif border rounded-lg px-2 py-2 bg-[rgb(193,117,45)]">
                    ImageCount:
                </span>{' '}
                <span className="border p-1 rounded bg-[rgb(193,117,45)]">
                    {images.length}
                </span>
            </div>

            {/* podetail */}
            <div className="w-full h-full px-5 mt-4">
                <div id='header' className="grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b font-bold bg-[rgb(173,97,25)] sticky top-0 z-10">
                    <div>Username</div>
                    <div>Images</div>
                    <div>Created At</div>
                    <div>GRN Email</div>
                    <div>GRN no.</div>
                    <div>GRN Time Taken</div>
                </div>

                {images.map((image, index) => (
                    <div
                        key={image._id}
                        className="grid grid-cols-2 md:grid-cols-6 gap-4 py-5 border-b"
                    >
                        <div>{image.user?.username || 'Unknown User'}</div>
                        <div>
                            <img
                                src={image.path}
                                alt={image.filename}
                                onDoubleClick={() => window.open(image.path, '_blank')}
                                className="h-[3rem] w-[4rem] rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </div>
                        <div>
                            {image.createdAt
                                ? new Date(image.createdAt).toLocaleString()
                                : 'N/A'}
                        </div>
                        <div>{image.GRNemail ? `${image.GRNemail}` : `Not Available Yet`}</div>
                        <div>
                            {image.GRNnumber ? image.GRNnumber : 'Not Available Yet'}
                        </div>
                        <div>
                            {image.GRNtimeTaken
                                ? `${image.GRNtimeTaken}`
                                : 'Not Available Yet'}
                        </div>




                    </div>
                ))}
            </div>
        </div>
    );
};

export default GRNdetails;
