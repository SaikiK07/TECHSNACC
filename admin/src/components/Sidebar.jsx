import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaBoxOpen, FaTags, FaPlus, FaClipboardList, FaShoppingCart, FaAddressBook, FaDatabase } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen text-gray-800 border-r-2 shadow-md">
      <div className="flex flex-col gap-6 pt-8 pl-6">
        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/user"
        >
          <FaUsers className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Users</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/category"
        >
          <FaTags className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Category</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/brand"
        >
          <FaBoxOpen className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Brand</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/add"
        >
          <FaPlus className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Add Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/list"
        >
          <FaClipboardList className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">List Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/orders"
        >
          <FaShoppingCart className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Orders</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/contacts"
        >
          <FaAddressBook className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Contacts</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          to="/backup"
        >
          <FaDatabase className="text-xl text-gray-600" />
          <p className="hidden md:block text-gray-800">Backup</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
