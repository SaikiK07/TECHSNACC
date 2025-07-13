import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaCheckCircle } from 'react-icons/fa';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Order Management</h2>
      <div className="w-full max-w-5xl space-y-4">
        {orders.length > 0 ? (
          orders
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((order, index) => (
              <div
                key={index}
                className="bg-gray-50 shadow-md rounded-lg p-6 border-l-4 border-blue-500 flex flex-col md:flex-row md:justify-between items-start"
              >
                {/* Order Details */}
                <div className="flex items-center space-x-4">
                  <FaBoxOpen className="text-blue-500 text-3xl" />
                  <div>
                    <p className="text-lg font-semibold">{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-gray-600">{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                    <p className="text-gray-500">Phone: {order.address.phone}</p>
                    <p className="text-gray-500">Payment: {order.payment ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>

                {/* Items & Amount */}
                <div className="mt-4 md:mt-0 text-gray-700">
                  <p className="text-lg font-semibold">{currency}{order.amount}</p>
                  <p className="text-sm">Items: {order.items.length}</p>
                  <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>

                {/* Status Update */}
                <div className="mt-4 md:mt-0">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="p-2 border rounded-md bg-gray-50 text-gray-700"
                  >
                    <option value="OrderPlaced">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
