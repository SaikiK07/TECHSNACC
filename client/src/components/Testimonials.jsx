import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from './Title';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/high-rated`);
        const fetchedTestimonials = Array.isArray(res.data.reviews)
          ? res.data.reviews
          : [];
        setTestimonials(fetchedTestimonials);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [backendUrl]);

  if (loading) return <div className="text-center py-10">Loading testimonials...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="my-16">
      <div className="text-center py-8">
        <Title text1="CUSTOMER" text2="REVIEWS" />
        <p className="text-md text-gray-500 mt-2">What our customers are saying about us!</p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ease-in-out h-full flex flex-col justify-between min-h-[300px]">
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800 truncate">{item.userId?.name}</h3>
                  <p className="text-gray-700 mb-3 italic text-lg line-clamp-3">
                    "{item.comment}"
                  </p>
                </div>
                {item.productId && (
                  <p className="text-sm text-gray-500 mt-auto">
                    Product: <span className="font-medium text-gray-900">{item.productId.name}</span>
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
