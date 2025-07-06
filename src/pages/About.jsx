import React from "react";
import { assets } from '../assets/assets'
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Who We Are</h1>
        <p className="text-lg text-gray-600">
          We are passionate about delivering high-quality products and an exceptional shopping experience.  
        </p>
      </div>

      {/* Image and Content Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img 
          src={assets.h1} 
          alt="About Us" 
          className="rounded-lg shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Our Story</h2>
          <p className="text-gray-600">
            We started with a simple goal – to make shopping more enjoyable and hassle-free. 
            Our team works tirelessly to source the best products, ensuring that every purchase you make is worth it.
          </p>
          <p className="mt-4 text-gray-600">
            With a commitment to customer satisfaction, we strive to bring you the best deals while maintaining top-notch quality.
          </p>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900">Quality Products</h3>
          <p className="text-gray-600 mt-2">Handpicked items with the best quality and durability.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900">Fast Delivery</h3>
          <p className="text-gray-600 mt-2">Get your orders delivered quickly and safely.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900">Customer Support</h3>
          <p className="text-gray-600 mt-2">Our team is here to help you 24/7 with any queries.</p>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Join Our Journey</h2>
        <p className="text-gray-600 mb-6">Experience the best shopping service with us. Start exploring now!</p>
        <Link 
          to="/Collection" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default About;
