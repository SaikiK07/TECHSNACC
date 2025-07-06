import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios'

const SignUp = () => {
  const { backendUrl, token, setToken ,setIsLoggedin,getUserData} = useContext(ShopContext)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    // Track missing fields
    const missingFields = [];
    if (!name || name.trim().length === 0) missingFields.push("name");
    if (!username || username.trim().length === 0) missingFields.push("username");
    if (!email || email.trim().length === 0) missingFields.push("email");
    if (!password || password.trim().length === 0) missingFields.push("password");
    if (!confirmPassword || confirmPassword.trim().length === 0) missingFields.push("confirm password");
  
    // Show single or multiple missing field messages
    if (missingFields.length === 1) {
      toast.error(`Please enter ${missingFields[0]}.`);
      return;
    } else if (missingFields.length > 1) {
      toast.error("Please enter all required fields.");
      return;
    }
  
    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }
  
    // Proceed to backend
    try {
      const response = await axios.post(backendUrl + '/api/auth/register', {
        name,
        username,
        email,
        password,
        captcha: captchaValue
      });
  
      if (response.data.success) {
        setToken(response.data.token);
        setIsLoggedin(true);
        getUserData();
        localStorage.setItem('token', response.data.token);
        toast.success("Success");
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  useEffect(()=>{
      if (token) {
        navigate('/login')
      }
    },[token])

  return (
    <div className=''>
      <section className="relative flex flex-wrap lg:items-center mt-16">
        <div className="relative lg:h-[600px] h-96 w-full lg:w-1/2 bg-image text-white rounded-3xl"
          style={{ backgroundImage: `url(${assets.h5})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-5xl mb-4 lg:mt-60 mt-36 prata-regular">
            TECHSNACC
            </h1>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Saiki Accessories Portal
            </h1>
          </div>
        </div>
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4 lg:mt-24 mt-14 text-green-800 hover:text-green-900 ">
              SIGN UP
            </h1>
          </div>
          <form onSubmit={onSubmitHandler} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="grow" placeholder="Name" />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="grow" placeholder="Username" />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path
                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="grow" placeholder="Email" />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="grow" placeholder='Password' />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="grow" placeholder='Confirm Password' />
              </label>
            </div>
            <ReCAPTCHA
              sitekey="6LcDBe8qAAAAAHiq8sQObi-6Qd2Gkq58H1GhODKO"
              onChange={(value) => setCaptchaValue(value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Already have an account?
                <Link to='/login'>
                  <a>Login here</a>
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="inline-block rounded-full bg-green-800 hover:bg-green-900 px-5 py-3 text-sm font-medium text-white w-full"
            >
              Sign in
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default SignUp