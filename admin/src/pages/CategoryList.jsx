import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

const CategoryList = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", attributes: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const parseAttributes = (inputString) => {
    return inputString.split(",").map(attr => ({ name: attr.trim() }));
  };

  const addCategory = async () => {
    if (!newCategory.name || !newCategory.attributes) {
      toast.error("Please fill all fields");
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const parsedAttributes = parseAttributes(newCategory.attributes);

      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        {
          name: newCategory.name,
          attributes: parsedAttributes
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setNewCategory({ name: "", attributes: "" });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!editingCategory.name || !editingCategory.attributes) {
      toast.error("Please fill all fields");
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const parsedAttributes = parseAttributes(editingCategory.attributes);

      const response = await axios.post(
        `${backendUrl}/api/category/update`,
        {
          id: editingCategory._id,
          name: editingCategory.name,
          attributes: parsedAttributes
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingCategory(null);
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/delete`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const openAddCategoryModal = () => {
    setIsAddingCategory(true);
    setIsModalOpen(true);
    setNewCategory({ name: "", attributes: "" });
  };

  const openEditCategoryModal = (category) => {
    setIsAddingCategory(false);
    setEditingCategory({
      ...category,
      attributes: category.attributes.map(attr => attr.name).join(", ")
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: "", attributes: "" });
  };

  return (
    <div className="p-8 bg-gradient-to-r bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Category Management</h2>

      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Categories</h3>
        {categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100"
              >
                <div>
                  <p className="text-gray-700 text-lg font-semibold">{category.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {Array.isArray(category.attributes)
                      ? category.attributes.map(attr => attr.name || attr).join(", ")
                      : "No attributes"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openEditCategoryModal(category)}
                    disabled={loading}
                    className="text-gray-600 hover:text-blue-500 disabled:opacity-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    disabled={loading}
                    className="text-gray-500 hover:text-red-400 disabled:opacity-50"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No categories available.</p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={openAddCategoryModal}
            disabled={loading}
            className="bg-green-900 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

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
                  isAddingCategory
                    ? setNewCategory({ ...newCategory, name: e.target.value })
                    : setEditingCategory({ ...editingCategory, name: e.target.value });
                }}
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Attributes (comma-separated)"
                value={isAddingCategory ? newCategory.attributes : editingCategory?.attributes}
                onChange={(e) => {
                  isAddingCategory
                    ? setNewCategory({ ...newCategory, attributes: e.target.value })
                    : setEditingCategory({ ...editingCategory, attributes: e.target.value });
                }}
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-between mt-6">
                <button
                  onClick={isAddingCategory ? addCategory : updateCategory}
                  disabled={loading}
                  className={`py-3 px-6 rounded-lg text-white flex items-center gap-2 ${
                    isAddingCategory
                      ? "bg-blue-900 hover:bg-blue-700"
                      : "bg-yellow-900 hover:bg-yellow-700"
                  } disabled:opacity-50`}
                >
                  {loading ? "Saving..." : isAddingCategory ? <><FaPlus /> Add</> : <><FaEdit /> Update</>}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-700 text-white py-3 px-14 rounded-lg hover:bg-gray-500"
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
