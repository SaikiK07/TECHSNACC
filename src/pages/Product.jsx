import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, userData, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [cat, setCat] = useState('');
  const [showDescription, setShowDescription] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(backendUrl + `/api/review/${productId}`);
        if (res.data.success) {
          setReviews(res.data.reviews);
        } else {
          setError(res.data.message || 'Failed to load reviews');
          toast.error(res.data.message || 'Failed to load reviews');
        }
      } catch (err) {
        setError('Something went wrong while fetching reviews.');
        toast.error('Something went wrong while fetching reviews.');
      } finally {
        setLoadingReviews(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const renderStars = (averageRating) => {
    const filledStars = Math.floor(averageRating);
    const emptyStars = 5 - filledStars;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<img key={i} src={assets.star_icon} alt="star" className="w-3.5" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<img key={filledStars + i} src={assets.star_dull_icon} alt="star" className="w-3.5" />);
    }

    return stars;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (newReview.rating === 0 || !newReview.comment) {
      toast.error('Please provide a rating and comment.');
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/review/add',
        { productId, ...newReview },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        setReviews([...reviews, response.data.review]);
        setNewReview({ rating: 0, comment: '' }); // Reset review form
        
        window.location.reload()
        toast.success('Review added successfully.');
      } else {
        toast.error(response.data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review', error);
      toast.error('There was an error submitting your review.');
    }
  };

  // Helper function to handle invalid date format
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return 'Invalid Date';
    }
    return parsedDate.toLocaleDateString();
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(productData.averageRating)} {/* Star rendering */}
            <p className="pl-2">({productData.totalRatings})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Option:</p>
            <div className="flex gap-2">
              {productData.category.attributes.map((item, index) => (
                <button
                  onClick={() => setCat(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === cat ? 'border-orange-500' : ''
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, cat)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash On Delivery is available on this product.</p>
            <p>Easy Return and Exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b
            onClick={() => {
              setShowDescription(true);
              setShowReviews(false);
            }}
            className="border px-5 py-3 text-sm cursor-pointer"
          >
            Description
          </b>
          <p
            onClick={() => {
              setShowDescription(false);
              setShowReviews(true);
            }}
            className="border px-5 py-3 text-sm cursor-pointer"
          >
            Reviews ({productData.totalRatings})
          </p>
        </div>

        {/* Show Description or Reviews */}
        {showDescription && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.description}</p>
          </div>
        )}

        {showReviews && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            {/* Display Reviews */}
            {/* Show review form when logged in */}
            {userData && (
              <div className="mt-8 border px-6 py-6 text-sm text-gray-500">
                <h3 className="font-medium mb-4">Add a Review</h3>
                <form onSubmit={handleReviewSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex gap-2 mb-4">
                    {/* Star Rating Input */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        src={newReview.rating >= star ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        className="w-3.5 cursor-pointer"
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Write your review"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="flex flex-col gap-2 border-b py-4">
                  <div className="flex gap-1">
                    {renderStars(review.rating)} {/* Review stars */}
                  </div>
                  <p className="font-medium">{review.userId?.name || 'Anonymous'}</p> {/* Safe fallback */}
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <RelatedProduct category={productData.category} />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
