import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { backendUrl } from '../App';

const Dashboard = () => {
    const [salesData, setSalesData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [productsOrderedCount, setProductsOrderedCount] = useState([]);

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(formattedToday);
    const [endDate, setEndDate] = useState(formattedTomorrow);

    const COLORS = ["#1D4ED8", "#16A34A", "#D97706"]; // New vibrant colors

    // Fetch sales data
    const fetchSalesData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/salesdata`, {
                params: { startDate, endDate }
            });
            if (response.data.success) {
                const formattedData = response.data.sales.map(item => ({
                    date: item._id,
                    totalSales: item.totalSales,
                    orderCount: item.totalOrders
                }));
                setSalesData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    // Fetch payment data
    const fetchPaymentData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/order/paymentdata');
            if (response.data.success) {
                const formattedData = response.data.payments.map(item => ({
                    name: item._id,
                    value: item.totalSales
                }));
                setPaymentData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    // Fetch product order count data
    const fetchProductsOrderedCount = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/mostorder`);
            if (response.data.success) {
                const formattedData = response.data.productsOrderedCount.map(item => ({
                    name: item.productName,
                    value: item.totalQuantity
                }));
                setProductsOrderedCount(formattedData);
            }
        } catch (error) {
            console.error("Error fetching products ordered count:", error);
        }
    };

    useEffect(() => {
        fetchSalesData();
        fetchPaymentData();
        fetchProductsOrderedCount();
    }, []);

    const handleFilter = () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        fetchSalesData(); 
    };

    return (
        <div className="p-6 bg-white min-h-screen text-gray-900">
            <h2 className="text-center text-3xl font-bold mb-8 text-blue-500">Dashboard</h2>

            {/* Date Filter */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div>
                        <label className="block text-lg text-gray-800">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-white text-gray-900 border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-lg text-gray-800">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-white text-gray-900 border border-gray-300 rounded p-2"
                        />
                    </div>
                </div>
                <button
                    onClick={handleFilter}
                    className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 py-2 rounded mt-2 sm:mt-0"
                >
                    Apply Filter
                </button>
            </div>

            {/* Sales Chart */}
            <div className="mb-12">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">Sales Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Payment Method Pie Chart */}
            <div className="mb-12">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
                    <h3 className="text-xl font-semibold mb-4 text-green-400">Payment Method Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name }) => name.length > 12 ? `${name.slice(0, 12)}...` : name} // Shorten long labels
                                >
                                    {paymentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Ordered Products Pie Chart */}
            <div className="mb-12">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-400">Top Ordered Products</h3>
                    {productsOrderedCount && productsOrderedCount.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productsOrderedCount}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#82ca9d"
                                        dataKey="value"
                                        label={({ name }) => name.length > 12 ? `${name.slice(0, 12)}...` : name} // Shorten long labels
                                    >
                                        {productsOrderedCount.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No data available</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
