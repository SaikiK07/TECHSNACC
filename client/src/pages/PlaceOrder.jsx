import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [loading, setLoading] = useState(false)

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, userData } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const OnChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const OnSubmitHandler = async (event) => {
    event.preventDefault()
    if (loading) return

    if (!userData.isAccountVerified) {
      toast.error("Your account is not verified. Please verify your email before placing an order.")
      return
    }

    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = formData

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[A-Za-z\s]+$/
    const phoneRegex = /^[0-9]{10}$/
    const zipRegex = /^[0-9]{4,10}$/

    if (!firstName.trim() || !nameRegex.test(firstName)) return toast.error("Please enter a valid first name (letters only).")
    if (!lastName.trim() || !nameRegex.test(lastName)) return toast.error("Please enter a valid last name (letters only).")
    if (!emailRegex.test(email)) return toast.error("Please enter a valid email address.")
    if (!street.trim()) return toast.error("Please enter your street address.")
    if (!city.trim() || !nameRegex.test(city)) return toast.error("Please enter a valid city (letters only).")
    if (!state.trim() || !nameRegex.test(state)) return toast.error("Please enter a valid state (letters only).")
    if (!zipRegex.test(zipcode)) return toast.error("Please enter a valid zip code.")
    if (!country.trim() || !nameRegex.test(country)) return toast.error("Please enter a valid country (letters only).")
    if (!phoneRegex.test(phone)) return toast.error("Please enter a valid 10-digit phone number.")

    setLoading(true)
    try {
      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.attributes = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }

      if (method === 'cod') {
        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
        if (response.data.success) {
          setCartItems({})
          navigate('/order-success')
        } else {
          toast.error(response.data.message)
        }
      } else if (method === 'stripe') {
        const response = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
        if (response.data.success) {
          window.location.replace(response.data.session_url)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={OnSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={OnChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={OnChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input onChange={OnChangeHandler} name='email' value={formData.email} type="email" placeholder='Email Address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input onChange={OnChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input onChange={OnChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={OnChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input onChange={OnChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zip Code' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={OnChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input onChange={OnChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex=col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border px-3 p-2 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border px-3 p-2 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              disabled={loading}
              className={`px-16 py-3 text-sm text-white ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-black'} transition rounded`}>
              {loading ? 'Placing...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
