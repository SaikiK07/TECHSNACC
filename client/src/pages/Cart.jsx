import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const productId in cartItems) {
        for (const attr in cartItems[productId]) {
          if (cartItems[productId][attr] > 0) {
            tempData.push({
              _id: productId,
              attributes: attr,
              quantity: cartItems[productId][attr]
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  const handleCheckout = () => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      navigate('/place-order')
    }, 100)
  }

  return (
    <div className='min-h-screen border-t pt-14 px-4 sm:px-10 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>

        {/* Page Title */}
        <div className='mb-10 text-center'>
          <Title text1="Your" text2="Cart" />
        </div>

        {/* Empty Cart */}
        {cartData.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-center py-24'>
            <img src={assets.cart_icon} alt="Empty Cart" className='w-20 h-20 mb-6 opacity-60' />
            <p className='text-lg text-gray-600 mb-4'>Your cart is currently empty.</p>
            <Link to="/collection">
              <button className='px-6 py-2 border border-gray-400 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-black transition'>
                🛍️ Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

            {/* Left: Cart Items */}
            <div className='lg:col-span-2 space-y-6'>
              {cartData.map((item, index) => {
                const product = products.find(p => p._id === item._id)
                if (!product) return null

                return (
                  <div key={index} className='bg-white p-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>

                    {/* Product Info */}
                    <div className='flex gap-4 items-start sm:items-center w-full sm:w-2/3'>
                      <img src={product.image[0]} alt={product.name} className='w-24 h-24 object-cover rounded-md' />
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800'>{product.name}</h3>
                        <div className='flex flex-wrap gap-2 mt-2 text-sm text-gray-600'>
                          <span className='bg-gray-100 px-2 py-0.5 rounded'>{item.attributes}</span>
                          <span>{currency}{product.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Remove */}
                    <div className='flex items-center gap-3'>
                      <input
                        type='number'
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          if (value >= 1) updateQuantity(item._id, item.attributes, value)
                        }}
                        className='w-16 text-sm px-3 py-1 border rounded-md shadow-sm'
                      />
                      <button
                        onClick={() => updateQuantity(item._id, item.attributes, 0)}
                        className='text-red-500 hover:text-red-700 transition'
                        title='Remove Item'
                      >
                        <img src={assets.bin_icon} alt='Remove' className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right: Cart Total */}
            <div className='bg-white p-6 rounded-xl shadow-md'>
              <CartTotal />
              <div className='mt-6'>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full text-sm px-6 py-3 rounded-full font-medium text-white transition ${
                    loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-900'
                  }`}
                >
                  {loading ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>
              </div>
              <div className='mt-4 text-center'>
                <Link to="/collection" className='text-sm text-gray-600 hover:text-black transition'>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Cart
