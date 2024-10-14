import React from 'react'

const AccountantAdminSignup = () => {

    return (
        <>
            <div className='w-full h-screen bg-[rgb(173,97,25)] flex flex-col justify-center items-center'>
                <form className='w-[20rem] h-auto bg-[rgb(255,255,255)] rounded-2xl p-8 flex flex-col gap-10'>
                    <div className='border rounded-2xl p-2'>
                        <input type="text" name="username" placeholder='enter your username' className='outline-none' />
                    </div>

                    <div className='border rounded-2xl p-2'>
                        <input type="email" name="email" placeholder='enter your email' className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="password" name="password" placeholder='enter your password' className='outline-none' />
                    </div>
                    <div className='border rounded-2xl p-2'>
                        <input type="text" name="adminRegistrationToken" placeholder='enter your adminRegistrationToken' className='outline-none' />
                    </div>
                    <div className='border text-center rounded-2xl bg-[rgb(171,84,37)] text-xl p-1'>
                        <button type='submit'>
                            Accountant SignUp
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AccountantAdminSignup