const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
import axios from 'axios';
import React, { useState } from 'react';
const ImageUpload = () => {

    const [file, setfile] = useState('');
    const [image, setimage] = useState('');
    const [uploadedUrl, setUploadedUrl] = useState('');

    // previewFiles in the your webpage or clientside 😃😂🥰😎😐😀
    function previewFiles(selectedFile) {
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        // console.log(`image uploaded successfully in client side ${reader}`)
        reader.onloadend = () => {
            setimage(reader.result)
            // console.log(image)
        }
    }

    //😀😐😎🥰😂😃✅🤣 handleChange taking file input in react 
    const handleChange = (e) => {
        let selectedFile = e.target.files[0]
        setfile(selectedFile)
        previewFiles(selectedFile)
        // console.log(e.target.files[0])
    }


    //🤣✅😃😂🥰😎😐😀 upload image in the cloudinary by frontend
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            return null
        }
        const formData = new FormData();
        formData.append('image', file)
        //😀😐😎🥰😂😃✅🤣✂️💸 fetch data from frontend to backend mongodb and cloudinary 
        try {
            const response = await axios.post('http://localhost:3000/api/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUploadedUrl(response.data.cloudinaryUrl)//cloudniray url
            alert(`your has  successfully uploaded`)

        } catch (error) {
            alert(`Image Upload Failed ${error}`)

        }
    }


    return (
        <>
            {/* frontend logic here  */}
            <div className='w-full bg-[rgb(173,97,25)] flex flex-col h-auto items-center gap-5 p-10'>
                <form action="" onSubmit={e => { handleSubmit(e) }} className='w-full bg-[rgb(173,97,25)] flex flex-col items-center gap-5 p-10'>
                    <div className='w-[12rem] h-[10rem] bg-[rgb(0,128,128)] flex flex-col justify-center items-center  rounded-3xl'>
                        <input type="file" onChange={e => { handleChange(e) }} className='bg-[rgb(40,138,171)] w-24 text-center' required accept='image/png, image/jpg, image/jpeg, image/' />
                    </div>
                    <div className='bg-[rgb(29,170,147)] w-[10rem] text-center rounded-full'>
                        <button className='bg-[rgb(29,170,147)] w-full rounded-full py-2' type='submit'>Upload</button>
                    </div>
                </form>

                {image &&
                    <img src={image} alt="sahil" />
                }

            </div>
        </>
    );
};

export default ImageUpload;



