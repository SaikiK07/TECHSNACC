import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
            <h1 className='mb-5 w-32'>TECHSNACC</h1>
                <p className='w-full md:w-2/3 text-gray-600'>
    Discover a wide range of computer accessories designed to enhance your productivity and comfort. From ergonomic keyboards and high-quality mice to durable laptop bags and reliable power supplies, we offer everything you need to optimize your workspace. Browse our collection for top-rated accessories that suit every tech enthusiast’s needs.
</p>

            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+1-232-324-6455</li>
                    <li>contact@email.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ Saiki.Kusuo- All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer