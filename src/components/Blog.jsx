import React from 'react'
import Title from './Title'
import { Link } from 'react-router-dom'

const Blog = () => {
  return (
    <div className='mt-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'OUR AMAZING'} text2={'BLOGS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                
            </p>
        <Link to='/about'>
        <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg mt-10 w-96">
            <img
                alt=""
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                className="h-56 w-full object-cover"
            />

            <div className="bg-white p-4 sm:p-6">
                <time datetime="2022-10-10" className="block text-xs text-gray-500"> 10th Oct 2022 </time>

                <a href="#">
                    <h3 className="mt-0.5 text-lg text-gray-900">Essential Computer Accessories for a Productive Workspace</h3>
                </a>

                <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                    In today's digital age, having the right computer accessories can significantly enhance your productivity and comfort. From ergonomic keyboards and mice to high-quality monitors and cable organizers, the right tools can make all the difference. Explore various options that cater to your needs, whether you're working from home or in an office setting. Discover how these accessories can streamline your workflow and improve your overall computing experience.
                </p>
            </div>

        </article>
        </Link>

        </div>

    </div>
  )
}

export default Blog