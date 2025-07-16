import React from 'react'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import User from './pages/User';
import Orders from './pages/Orders';
import Login from './components/Login';
import { useState } from 'react';

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react';
import Update from './pages/Update';
import Dashboard from './pages/Dashboard';
import ContactList from './pages/ContactList';
import CategoryList from './pages/CategoryList';
import BackupPage from './pages/BackupPage';
import BrandList from './pages/BrandList';

export const backendUrl = import.meta.env.VITE_BACKEND_URI
export const currency ='₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):'')
  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path="/user" element={<User token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/update/:id" element={<Update token={token} />} />
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/contacts" element={<ContactList token={token} />} />
                <Route path="/category" element={<CategoryList token={token} />} />
                <Route path="/brand" element={<BrandList token={token} />} />
                <Route path="/backup" element={<BackupPage token={token} />} />

              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App