import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'

const Login = () => {
  const { backendUrl, token, setToken, setIsLoggedin, getUserData, userData } = useContext(ShopContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaValue, setCaptchaValue] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    axios.defaults.withCredentials = true

    const missingFields = []
    if (!email.trim()) missingFields.push("email")
    if (!password.trim()) missingFields.push("password")

    if (missingFields.length === 1) {
      toast.error(`Please enter ${missingFields[0]}.`)
      setLoading(false)
      return
    } else if (missingFields.length > 1) {
      toast.error("Please enter all required fields.")
      setLoading(false)
      return
    }

    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA.")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(backendUrl + '/api/auth/login', {
        email,
        password,
        captcha: captchaValue
      })

      if (response.data.success) {
        setToken(response.data.token)
        setIsLoggedin(true)
        getUserData()
        localStorage.setItem('token', response.data.token)
        toast.success("Login successful")
        navigate('/') // ✅ no reload
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

 useEffect(() => {
  if (token && token.trim() !== '' && userData) {
    navigate('/')
  }
}, [token, userData])


  return (
    <div>
      <section className="relative flex flex-wrap lg:items-center mt-16">
        {/* Left Side Image */}
        <div className="relative lg:h-[600px] h-96 w-full lg:w-1/2 bg-image text-white rounded-3xl"
          style={{ backgroundImage: `url(${assets.h5})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-5xl mb-4 lg:mt-60 mt-36 prata-regular">
              TECHSNACC
            </h1>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Saiki Accessories Portal</h1>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4 lg:mt-24 mt-14 text-green-800 hover:text-green-900">
              LOGIN
            </h1>
          </div>

          <form onSubmit={onSubmitHandler} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            {/* Email */}
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 opacity-70" viewBox="0 0 16 16">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="grow"
                />
              </label>
            </div>

            {/* Password */}
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 opacity-70" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  className="grow"
                />
              </label>
            </div>

            {/* reCAPTCHA */}
            <ReCAPTCHA
              sitekey="6LcDBe8qAAAAAHiq8sQObi-6Qd2Gkq58H1GhODKO"
              onChange={(value) => setCaptchaValue(value)}
            />

            {/* Links */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span onClick={() => navigate('/reset-password')} className="cursor-pointer hover:text-blue-600">
                Forgot password?
              </span>
              <span>
                Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`inline-block rounded-full px-5 py-3 text-sm font-medium w-full text-white ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-900"}`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Login
