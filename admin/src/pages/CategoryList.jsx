import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

const CategoryList = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", attributes: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if modal is open (for add/update)
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Track if we are adding or editing

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  // Add a new category
  const addCategory = async () => {
    if (!newCategory.name || !newCategory.attributes) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/category/add`, newCategory, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setNewCategory({ name: "", attributes: "" });
        setIsModalOpen(false); // Close modal after success
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    }
  };

  // Update category
  const updateCategory = async () => {
    if (!editingCategory.name || !editingCategory.attributes) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/category/update`,
        { id: editingCategory._id, name: editingCategory.name, attributes: editingCategory.attributes },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingCategory(null); // Reset editing category
        setIsModalOpen(false); // Close modal after success
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/category/delete`, { id }, { headers: { token } });
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle between adding and editing
  const openAddCategoryModal = () => {
    setIsAddingCategory(true);
    setIsModalOpen(true);
    setNewCategory({ name: "", attributes: "" }); // Reset form for adding new category
  };

  const openEditCategoryModal = (category) => {
    setIsAddingCategory(false);
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: "", attributes: "" });
  };

  return (
    <div className="p-8 bg-gradient-to-r bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Category Management</h2>

      {/* Category List */}
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Categories</h3>
        {categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200">
                <span className="text-gray-700 text-lg">{category.name}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openEditCategoryModal(category)} // Open edit modal
                    className="text-gray-600 hover:text-blue-500 transition duration-300"
                    aria-label={`Edit ${category.name}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="text-gray-500 hover:text-red-400 transition duration-300"
                    aria-label={`Delete ${category.name}`}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
            <li>
              {/* Add Button */}
              <button
                onClick={openAddCategoryModal} // Open add modal
                className="mb-8 bg-green-900 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition duration-300"
              >
                <FaPlus />
              </button>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">No categories available.</p>
        )}
      </div>

      {/* Modal for Add or Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              {isAddingCategory ? "Add New Category" : "Edit Category"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={isAddingCategory ? newCategory.name : editingCategory?.name}
                onChange={(e) => {
                  if (isAddingCategory) {
                    setNewCategory({ ...newCategory, name: e.target.value });
                  } else {
                    setEditingCategory({ ...editingCategory, name: e.target.value });
                  }
                }}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Attributes (comma-separated)"
                value={isAddingCategory ? newCategory.attributes : editingCategory?.attributes}
                onChange={(e) => {
                  if (isAddingCategory) {
                    setNewCategory({ ...newCategory, attributes: e.target.value });
                  } else {
                    setEditingCategory({ ...editingCategory, attributes: e.target.value });
                  }
                }}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between">
                <button
                  onClick={isAddingCategory ? addCategory : updateCategory}
                  className={`mb-8 py-3 px-6 rounded-lg flex items-center gap-2 transition duration-300 ${
                    isAddingCategory ? "bg-blue-900 hover:bg-blue-700" : "bg-yellow-900 hover:bg-yellow-700"
                  } text-white`}
                >
                  {isAddingCategory ? (
                    <>
                      <FaPlus /> Add Category
                    </>
                  ) : (
                    <>
                      <FaEdit /> Update Category
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="mb-8 bg-gray-700 text-white py-3 px-14 rounded-lg hover:bg-gray-500 focus:ring-2 focus:ring-gray-500 transition duration-300 flex items-center gap-2 w-[180px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;