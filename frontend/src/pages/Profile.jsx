import React from 'react'
import profile from '../assets/profile.jpeg'

const Profile = () => {
    return (
        <>
            <div className='w-full flex justify-center py-4'>
                <div className='w-[20rem] h-[25rem] bg-black shadow-lg rounded-2xl'>
                    <div className='h-1/2 w-full'>
                        <img className='h-full w-full object-cover' src={profile} alt="" />
                    </div>
                    <div className='h-1/2 flex flex-col justify-center items-center gap-8 text-white font-semibold'>
                        <span className='text-4xl'>Cartrends</span>
                        <span>Employee at Cartrends</span>
                        <span className='border rounded-2xl w-auto px-5 py-1 hover:bg-white hover:text-black shadow-[0_2px_6px_rgba(255,255,255,0.5)]'>
                            <button>Contact Us</button>
                        </span>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Profile