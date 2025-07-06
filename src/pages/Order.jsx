import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from backend
  const loadOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });

      if (response.data.success) {
        const allOrdersItem = response.data.orders.flatMap(order =>
          order.items.map(item => ({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            orderId: order._id,
          }))
        );
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders.');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const handleBillClick = (order) => {
    setSelectedOrder(order);
    setShowBill(true);
  };

  const handleBillClose = () => setShowBill(false);

  const downloadInvoice = async () => {
    if (!selectedOrder) return;

    try {
      const res = await axios.get(`${backendUrl}/api/order/invoice/${selectedOrder.orderId}`, {
        headers: { token },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${selectedOrder.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  // Status Indicator with color coding
  const renderStatusIndicator = (status) => {
    let color = 'bg-gray-500';
    if (status === 'Packing') color = 'bg-yellow-500';
    else if (status === 'Shipped') color = 'bg-blue-500';
    else if (status === 'Out for delivery') color = 'bg-orange-500';
    else if (status === 'Delivered') color = 'bg-green-500';

    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <p className="text-sm md:text-base">{status}</p>
      </div>
    );
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-4">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No orders found.</p>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4"
            >
              {/* Product Image & Details */}
              <div className="flex items-start gap-6 text-sm">
                <img src={item.image[0]} className="w-16 sm:w-20 rounded-md object-cover" alt={item.name} />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>{currency}{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Option: {item.attributes}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Date: {new Date(item.date).toDateString()}</p>
                  <p className="mt-1 text-sm text-gray-500">Payment: {item.paymentMethod}</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="md:w-1/2 flex justify-between items-center">
                {renderStatusIndicator(item.status)}
                <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  Track Order
                </button>
                <button onClick={() => handleBillClick(item)} className="border px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  View Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showBill && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-11/12 md:w-1/2 rounded-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Invoice for <span className="text-indigo-600">{selectedOrder.name}</span>
            </h2>
            <p>Order ID: <span className="text-gray-600">{selectedOrder.orderId}</span></p>
            <p>Order Date: {new Date(selectedOrder.date).toDateString()}</p>
            <p>Payment Method: {selectedOrder.paymentMethod}</p>
            <p>Quantity: {selectedOrder.quantity}</p>
            <p>Price: {currency}{selectedOrder.price}</p>

            {/* Modal Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button onClick={handleBillClose} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
                Close
              </button>
              <button onClick={downloadInvoice} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
