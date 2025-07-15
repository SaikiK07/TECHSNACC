import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

const BrandList = ({ token }) => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/brand/list`);
      if (response.data.success) {
        setBrands(response.data.brands);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch brands");
    }
  };

  const addBrand = async () => {
    if (!newBrand.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/brand/add`,
        { name: newBrand },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setNewBrand("");
        setIsModalOpen(false);
        fetchBrands();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async () => {
    if (!editingBrand?.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/brand/update`,
        { id: editingBrand._id, name: editingBrand.name },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingBrand(null);
        setIsModalOpen(false);
        fetchBrands();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/brand/delete`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete brand");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Brand Management</h2>
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Brands</h3>
        {brands.length > 0 ? (
          <ul className="space-y-4">
            {brands.map((brand) => (
              <li
                key={brand._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md"
              >
                <span className="text-gray-700 text-lg">{brand.name}</span>
                <div className="flex items-center gap-4">
                  <button
                    disabled={loading}
                    onClick={() => {
                      setEditingBrand(brand);
                      setIsModalOpen(true);
                      setIsAddingBrand(false);
                    }}
                    className="text-gray-600 hover:text-blue-500 disabled:opacity-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => deleteBrand(brand._id)}
                    className="text-gray-500 hover:text-red-400 disabled:opacity-50"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No brands available.</p>
        )}
        <button
          disabled={loading}
          onClick={() => {
            setIsAddingBrand(true);
            setIsModalOpen(true);
            setNewBrand("");
          }}
          className="mt-6 bg-green-900 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <FaPlus />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              {isAddingBrand ? "Add New Brand" : "Edit Brand"}
            </h3>
            <input
              type="text"
              placeholder="Brand Name"
              value={isAddingBrand ? newBrand : editingBrand?.name}
              onChange={(e) =>
                isAddingBrand
                  ? setNewBrand(e.target.value)
                  : setEditingBrand({ ...editingBrand, name: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-between mt-6">
              <button
                disabled={loading}
                onClick={isAddingBrand ? addBrand : updateBrand}
                className={`py-3 px-6 rounded-lg text-white flex items-center gap-2 ${
                  isAddingBrand
                    ? "bg-blue-900 hover:bg-blue-700"
                    : "bg-yellow-900 hover:bg-yellow-700"
                } disabled:opacity-50`}
              >
                {isAddingBrand ? <FaPlus /> : <FaEdit />}
                {loading ? "Saving..." : isAddingBrand ? "Add Brand" : "Update Brand"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBrand(null);
                }}
                className="bg-gray-700 text-white py-3 px-14 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
