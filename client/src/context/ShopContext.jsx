import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₹';
  const delivery_fee = 100;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const [token, setToken] = useState('');
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const addToCart = async (itemId, cat) => {
    if (!cat) return toast.error('Select Option');

    const cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][cat] = (cartData[itemId][cat] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId, cat }, {
          headers: { token }
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, cat, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][cat] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, cat, quantity }, {
          headers: { token }
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let total = 0;
    for (const id in cartItems) {
      for (const option in cartItems[id]) {
        total += cartItems[id][option];
      }
    }
    return total;
  };

  // ✅ FIXED: Now it's a synchronous function
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (!product) continue;
      for (const option in cartItems[id]) {
        total += product.price * cartItems[id][option];
      }
    }
    return total;
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/product/list');
      if (res.data.success) setProducts(res.data.products);
      else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getUserCart = async (customToken) => {
    try {
      const res = await axios.post(backendUrl + '/api/cart/get', {}, {
        headers: { token: customToken }
      });
      if (res.data.success) setCartItems(res.data.cartData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getUserData = async (customToken = token) => {
    try {
      const res = await axios.get(backendUrl + '/api/user/data', {
        headers: { token: customToken }
      });
      if (res.data.success) {
        setUserData(res.data.userData);
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (err) {
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  const getAuthState = async (customToken = token) => {
  try {
    const res = await axios.get(backendUrl + '/api/auth/is-auth', {
      headers: { token: customToken }
    });
    if (res.data.success) {
      setIsLoggedin(true);
      await getUserData(customToken);
    } else {
      setIsLoggedin(false);
      setUserData(null);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      setToken('');
      setIsLoggedin(false);
      setUserData(null);
      navigate('/login');
    } else {
      console.error('Auth error:', err);
    }
  }
};


  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
      axios.defaults.headers.common['token'] = localToken;
    }
  }, []);

  useEffect(() => {
    if (token) {
      getAuthState(token);
      getUserCart(token);
    }
  }, [token]);

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products, currency, delivery_fee,
    backendUrl, token, setToken,
    addToCart, cartItems, setCartItems,
    getCartCount, updateQuantity, getCartAmount,
    navigate,
    search, setSearch, showSearch, setShowSearch,
    isLoggedin, setIsLoggedin, userData, setUserData,
    getUserData
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
