// src/pages/OrderSuccess.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-gray-700 mb-6 text-lg">Thank you for your purchase. Your items will be delivered soon.</p>
      <button 
        onClick={() => navigate('/orders')} 
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition"
      >
        Go to My Orders
      </button>
    </div>
  )
}

export default OrderSuccess
