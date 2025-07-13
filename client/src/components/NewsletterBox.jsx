import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler=(event)=>{
        event.preventDefault()
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
        Stay updated with the latest in tech accessories, tips, and exclusive offers delivered directly to your inbox. Don’t miss out on new arrivals and special discounts!
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex itmes-center gap-3 mx-auto my-6 border pl-3'>
            <input type="email" className='w-full sm:flex-1 outline-none' name="" id="" placeholder='Enter Your Email' />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox