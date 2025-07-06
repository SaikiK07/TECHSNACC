import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from '../assets/assets'; // Importing assets for star icons

const ProductItem = ({ id, image, name, price, averageRating, totalRatings }) => {
  const { currency } = useContext(ShopContext);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<img key={`full-${i}`} src={assets.star_icon} alt="star" className="w-3.5" />); // Using filled star icon
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<img key={`empty-${i}`} src={assets.star_dull_icon} alt="star" className="w-3.5" />); // Using empty star icon
    }

    return stars;
  };

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-0.5 w-[88%] h-[100%]">
        
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg group aspect-[4/3]">
          <img
            src={image && image[0]}
            alt={name}
            className="h-full w-full object-cover object-fit-cover aspect-square transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="mt-3 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200">
            {name}
          </h3>

          {/* Price */}
          <div className="price-section mt-2">
            <span className="current-price text-base font-bold text-gray-900">
              {currency}{price}
            </span>
          </div>

          {/* Rating Section */}
          <div className="rating-section mt-2 flex items-center">
            <div className="stars flex">
              {renderStars(averageRating || 0)} {/* Updated to use image stars */}
            </div>
            <span className="rating-count ml-2 text-sm text-gray-600">
              ({totalRatings || 0})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
