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
    if (!cat) {
      toast.error('Select Option');
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][cat]) {
        cartData[itemId][cat] += 1;
      } else {
        cartData[itemId][cat] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][cat] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId, cat }, {
          headers: { token }
        });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, cat, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][cat] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, cat, quantity }, {
          headers: { token }
        });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) { }
      }
    }
    return totalCount;
  };

  const getCartAmount = async () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) { }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (tokenArg) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, {
        headers: { token: tokenArg }
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Make sure getUserData(token) properly sets the user:
const getUserData = async (customToken = token) => {
  console.log("📡 Calling getUserData with token:", customToken); // <== Log this

  try {
    const { data } = await axios.get(backendUrl + '/api/user/data', {
      headers: { token: customToken }
    });

    console.log("📦 getUserData full response:", JSON.stringify(data, null, 2));
 // <== Log this too

    if (data.success) {
      setUserData(data.userData);
      setIsLoggedin(true);
    } else {
      setUserData(null);
      setIsLoggedin(false);
      toast.error(data.message);
    }
  } catch (error) {
    console.log("❌ getUserData error:", error.response?.data || error.message); // <== Log error
    setUserData(null);
    setIsLoggedin(false);
    toast.error(error.response?.data?.message || error.message);
  }
};



  const getAuthState = async (customToken = token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        headers: { token: customToken }
      });
      if (data.success) {
        setIsLoggedin(true);
        await getUserData(customToken);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 1️⃣ Load token first (once)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['token'] = storedToken;
    }
  }, []);

  // 2️⃣ Then once token is set, run auth & cart functions
  useEffect(() => {
    if (token) {
      getAuthState(token);
      getUserCart(token);
    }
  }, [token]);

  // 3️⃣ Load products
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

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
