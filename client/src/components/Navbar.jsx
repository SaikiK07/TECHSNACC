import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    token,
    setToken,
    getCartCount,
    userData,
    setUserData,
    backendUrl,
    setIsLoggedin
  } = useContext(ShopContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null); // ✅ use null instead of false
        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
        window.location.reload(); // ✅ if needed to fully reset context
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="w-full shadow-md bg-white z-50 left-0">
      <nav className="max-w-6xl mx-auto px-4 sm:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-widest text-black">
          TECHSNACC
        </Link>

        {/* Desktop Links */}
        <ul className="hidden sm:flex gap-6 items-center text-sm font-medium text-gray-700">
          {['/', '/collection', '/about', '/contact'].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `hover:text-black transition relative group ${
                  isActive ? 'text-black' : ''
                }`
              }
            >
              <span>{path === '/' ? 'HOME' : path.replace('/', '').toUpperCase()}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-700 group-hover:w-full transition-all duration-300"></span>
            </NavLink>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          <img
            onClick={() => {
              setShowSearch(true); // ✅ fix search visibility
              navigate('/collection'); // ensure navigation if needed
            }}
            src={assets.search_icon}
            alt="search"
            className="w-5 cursor-pointer"
          />

          {userData ? (
            <div className="relative group">
              <div className="w-8 h-8 flex justify-center items-center bg-black text-white rounded-full cursor-pointer">
                {userData.name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col bg-white shadow-md rounded-md py-2 w-40 z-50 text-sm text-gray-600">
                <span
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </span>
                <span
                  onClick={() => navigate('/orders')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Orders
                </span>
                <span
                  onClick={logout}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-[6px] text-sm border border-black rounded hover:bg-black hover:text-white transition"
            >
              Login
            </button>
          )}

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} alt="cart" className="w-5" />
            <span className="absolute -bottom-1 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu"
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-lg transition-transform duration-300 z-50 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col text-gray-700 p-6 gap-4">
          <button onClick={() => setVisible(false)} className="self-end text-2xl">
            &times;
          </button>
          <NavLink onClick={() => setVisible(false)} to="/" className="border-b pb-2">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/collection" className="border-b pb-2">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/about" className="border-b pb-2">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to="/contact" className="border-b pb-2">
            CONTACT
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
