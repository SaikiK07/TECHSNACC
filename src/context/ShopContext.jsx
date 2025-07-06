import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

export const ShopContext = createContext();

const ShopContextProvider =(props)=>{

    const currency='₹'
    const delivery_fee = 100
    const [search,setSearch] = useState('')
    const [showSearch,setShowSearch] =useState(false)

    axios.defaults.withCredentials = true

    const backendUrl =import.meta.env.VITE_BACKEND_URI
    const [token,setToken] = useState('')
    const [isLoggedin,setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)
    const [products, setProducts] =useState([])
    const [cartItems,setCartItems] =useState({})
    const navigate =useNavigate()

    const addToCart = async (itemId,cat)=>{
 
        if (!cat) {
            toast.error('Select Option')
            return
        }

        let cartData = structuredClone(cartItems)
        if (cartData[itemId]) { 
            if (cartData[itemId][cat]) {
                cartData[itemId][cat] +=1
            } else {
                cartData[itemId][cat] = 1
            }
               
        } else {
            cartData[itemId] = {}
            cartData[itemId][cat] = 1
        }
        setCartItems(cartData)

        if (token) {
            
            try {

                await axios.post(backendUrl + '/api/cart/add',{itemId,cat},{headers:{token}} )

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const updateQuantity = async (itemId,cat,quantity) =>{
        let cartData =structuredClone(cartItems)

        cartData[itemId][cat] = quantity

        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update',{itemId,cat,quantity},{headers:{token}})

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

        const getCartCount = ()=>{
            let totalCount = 0
            for(const items in cartItems){
                for(const item in cartItems[items]){
                    try {
                        if (cartItems[items][item] > 0) {
                            totalCount += cartItems[items][item]
                        }
                    } catch (error) {
                        
                    }
                }
            }
            return totalCount
        }
        
    const getCartAmount = async =>{
        let totalAmount = 0
        for(const items in cartItems){
            let itemInfo = products.find((product) =>product._id === items)
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount
    }

    const getProductsData = async ()=>{
        try {
            
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)  
        }
    }

    const getUserCart = async (token) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)  
        }
    }

    useEffect(()=>{
        getProductsData()
    },[])

    const getUserData = async()=>{
        try {
            const {data} =await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedin(true)
                getUserData()
                
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    useEffect(()=>{
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    })


    const value={
        products, currency ,delivery_fee,
        backendUrl,token,setToken,
        addToCart,cartItems,setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        search,setSearch,showSearch,setShowSearch,
        isLoggedin,setIsLoggedin,userData,setUserData,
        getUserData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider