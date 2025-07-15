import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    if (!token || loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/order/verifyStripe',
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Payment verification failed');
        navigate('/cart');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
      navigate('/cart');
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
      {loading ? (
        <div className="text-xl text-blue-600 font-semibold animate-pulse">
          Verifying your payment...
        </div>
      ) : (
        <div className="text-xl text-gray-600 font-medium">
          Redirecting...
        </div>
      )}
    </div>
  );
};

export default Verify;
