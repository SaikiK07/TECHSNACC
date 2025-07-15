import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const User = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/listuser`);
      if (response.data.success) {
        setList(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/userremove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">User Management</h2>

      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Users</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : list.length > 0 ? (
          <ul className="space-y-4">
            {list.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200"
              >
                <div>
                  <p className="text-gray-700 text-lg font-semibold">{user.username}</p>
                  <p className="text-gray-600">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => removeUser(user._id)}
                  className="text-gray-500 hover:text-red-400 transition duration-300"
                  aria-label={`Delete ${user.username}`}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No users available.</p>
        )}
      </div>
    </div>
  );
};

export default User;
