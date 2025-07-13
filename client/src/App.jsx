import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Collection from './pages/Collection'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import SearchBar from './components/SearchBar'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Verify from './pages/Verify'
import OrderSuccess from './pages/OrderSuccess'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vm]'>
      <ToastContainer />
      <Navbar />
      <SearchBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/collection" element={<Collection/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/product/:productId" element={<Product/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/place-order" element={<PlaceOrder/>} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App