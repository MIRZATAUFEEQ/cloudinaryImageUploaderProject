import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [uploadedUrl, setUploadedUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated✅
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login page if no token is found✅
            alert('You need to login first to upload images');
            navigate('/login');
        }
    }, [navigate]);

    const previewFiles = (selectedFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    // logic for change input tag state✅
    const handleChange = (e) => {
        let selectedFile = e.target.files[0];
        setFile(selectedFile);
        previewFiles(selectedFile);
    };

    // logic for upload image ✅
    const handleSubmit = async (e) => {
        e.preventDefault();

        // check file is present in input or not 
        if (!file) {
            return alert('please select an image to upload')
        };

        // create a formdata variable✅
        const formData = new FormData();

        // add image by append method ✅
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');  // Get the token✅

            // api call in backend for send images in database✅
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/user/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include the token in headers
                    'Content-Type': 'multipart/form-data',
                },
            });

            // uploade image in url form in database
            setUploadedUrl(response.data.imageUrl);
            console.log(response.data)
            alert('Your image has been successfully uploaded');

        } catch (error) {
            console.log(error)
            alert(`Image Upload Failed: ${error}`);
        }
    };

    return (
        <div className="w-full bg-[rgb(173,97,25)] flex flex-col h-auto items-center gap-5 p-10">
            <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="w-full flex flex-col items-center gap-5 p-10">
                <div className="w-[12rem] h-[10rem] bg-[rgb(0,128,128)] flex flex-col justify-center items-center rounded-3xl">
                    <input
                        type="file"
                        onChange={handleChange}
                        className="bg-[rgb(40,138,171)] w-24 text-center"
                        required
                        name='file'
                        accept="image/png, image/jpg, image/jpeg"
                    />
                </div>
                <div className="bg-[rgb(29,170,147)] w-[10rem] text-center rounded-full">
                    <button type="submit" className="w-full py-2">
                        Upload
                    </button>
                </div>
            </form>
            {image && <img src={image} alt="Preview" />}
        </div>
    );
};

export default ImageUpload;
