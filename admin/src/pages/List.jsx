import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // Importing React Icons

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="p-8 bg-gradient-to-r bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Product Management</h2>
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-6 mx-auto">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_3fr_1fr_1fr] items-center py-3 px-4 border-b bg-gray-100 text-sm text-gray-600 font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr] items-center gap-4 py-3 px-4 border-b hover:bg-gray-50 transition-colors"
            key={index}
          >
            <img className="w-16 h-16 object-cover rounded-md" src={item.image[0]} alt={item.name} />
            <p className="text-gray-700">{item.name}</p>
            <p className="text-gray-600">{currency}{item.price}</p>
            <div className="flex justify-center gap-6 items-center ">
              <Link to={`/update/${item._id}`}>
                <button className="text-gray-600 hover:text-blue-500 transition duration-300 mt-1">
                  <FaEdit size={20} />
                </button>
              </Link>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-gray-500 hover:text-red-400 transition duration-300"
                aria-label={`Delete ${item.name}`}
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default List;
