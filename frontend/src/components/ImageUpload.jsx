import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [previewContent, setPreviewContent] = useState(''); // To store either the image preview or file name
    const [uploadedUrl, setUploadedUrl] = useState('');
    const navigate = useNavigate();

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login page if no token is found
            alert('You need to login first to upload files');
            navigate('/login');
        }
    }, [navigate]);

    const previewFiles = (selectedFile) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (selectedFile.type.startsWith('image/')) {
                setPreviewContent(reader.result); // Set image preview
            } else {
                setPreviewContent(selectedFile.name); // Set file name for non-image files
            }
        };
        if (selectedFile.type.startsWith('image/')) {
            reader.readAsDataURL(selectedFile); // Read the file for image previews
        } else {
            // For non-image files, we don't need to read the file
            setPreviewContent(selectedFile.name); // Display file name directly
        }
    };

    // Update input tag state logic
    const handleChange = (e) => {
        let selectedFile = e.target.files[0];
        setFile(selectedFile);
        previewFiles(selectedFile);
    };

    // Logic for uploading files
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if a file is selected
        if (!file) {
            return alert('Please select a file to upload');
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return alert(`File size exceeds the limit of 10 MB. Your file is ${Math.round(file.size / (1024 * 1024))} MB.`);
        }

        // Create a FormData instance
        const formData = new FormData();

        // Append the file (image, PDF, or Excel) to the FormData instance
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // Get the token

            // API call to backend to upload file to database
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in headers
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle backend response (for example, file details returned)
            if (response.data.success) {
                setUploadedUrl(response.data.fileUrl); // If the backend returns a URL or path
                alert(`Your ${file.type.includes('image') ? 'image' : 'file'} has been successfully uploaded to the database`);
            } else {
                alert('File upload failed');
            }

        } catch (error) {
            console.log(error);
            alert(`File Upload Failed: ${error}`);
        }
    };

    return (
        <div className="w-full bg-[rgb(1,1,1)] flex flex-col h-auto items-center gap-5 p-10">
            <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="w-full flex flex-col items-center gap-5 p-10">
                <div className="w-[12rem] h-[10rem] bg-[rgb(0,128,128)] flex flex-col justify-center items-center rounded-3xl border">
                    <input
                        type="file"
                        onChange={handleChange}
                        className="bg-[rgb(40,138,171)] w-24 text-center text-white"
                        required
                        name='file'
                        accept="image/png, image/jpg, image/jpeg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                </div>
                <div className="bg-[rgb(0,128,128)] w-[10rem] text-[rgb(255,254,254)] font-semibold text-center rounded-full border">
                    <button type="submit" className="w-full py-2">
                        Upload
                    </button>
                </div>
            </form>
            {/* Show preview or file name */}
            <div className="text-white">
                {file && previewContent && (
                    file.type.startsWith('image/') ? (
                        <img src={previewContent} alt='Uploaded file preview' className='h-32' />
                    ) : (
                        <p>{previewContent}</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
