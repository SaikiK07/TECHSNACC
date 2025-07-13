import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate();
  const [visible,setVisible] =useState(false)

  const {setShowSearch} = useContext(ShopContext)

  const {token, setToken, getCartCount,userData,setUserData,backendUrl,setIsLoggedin} = useContext(ShopContext)

  const logout =async()=>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      localStorage.removeItem('token')
      setToken('')
      navigate('/login')
      window.location.reload()  
    } catch (error) {
      toast.error(error.message)
    } 
  }

  const sendVerificationOtp =async()=>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='flex items-center justify-between py-5 font-medium'>

        <Link to='/'>
        <h1 className='w-36'>TECHSNACC</h1>
        </Link>

        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

          <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-green-700 hidden' />
          </NavLink>
          <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-green-700 hidden' />
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-green-700 hidden' />
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-green-700 hidden' />
          </NavLink>

        </ul>

        <div className='flex items gap-6'>
          <Link to='/collection'>
            <img onClick={()=>setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />
          </Link>

          {userData ?
          <div className='group z-50 w-7 h-7 flex justify-center items-center rounded-full bg-black text-white relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              
              <p onClick={()=>navigate('/profile')} className='cursor-pointer hover:text-black'>Profile</p>
              <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
              <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
            </div></div>

          </div>
          : 
          <img onClick={()=>navigate('/login')} src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
          }

          <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
          </Link>
          <img onClick={()=>setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
        </div>

        {/* Sidebar menu for smaller screen */}
        <div className={`absolute h-64 top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} z-50`}>
          <div className='flex flex-col text-gray-600'>
            <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512">
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          </div>
        </div>

    </div>
  )
}

export default Navbar