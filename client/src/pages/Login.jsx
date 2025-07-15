import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

const Login = () => {
  const {
    backendUrl,
    setToken,
    setIsLoggedin,
    getUserData
  } = useContext(ShopContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!email || !password) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
        captcha: captchaValue
      });

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['token'] = token;

        // ✅ Wait for user data before navigating
        await getUserData(token);
        setToken(token);
        setIsLoggedin(true);
        toast.success("Login successful");

        // ✅ Delay navigate to ensure context is synced
        setTimeout(() => {
          navigate('/');
        }, 200);
      } else {
        toast.error(res.data.message || 'Login failed');
        setIsLoggedin(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative flex flex-wrap lg:items-center mt-16">
        {/* Left Side */}
        <div className="relative lg:h-[600px] h-96 w-full lg:w-1/2 bg-image text-white rounded-3xl"
          style={{ backgroundImage: `url(${assets.h5})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-5xl mb-4 lg:mt-60 mt-36 prata-regular">TECHSNACC</h1>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Saiki Accessories Portal</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4 lg:mt-24 mt-14 text-green-800 hover:text-green-900">LOGIN</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="grow" />
              </label>
            </div>

            <div>
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="grow" />
              </label>
            </div>

            <ReCAPTCHA sitekey="6LcDBe8qAAAAAHiq8sQObi-6Qd2Gkq58H1GhODKO" onChange={setCaptchaValue} />

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span onClick={() => navigate('/reset-password')} className="cursor-pointer hover:text-blue-600">Forgot password?</span>
              <span>Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-block rounded-full px-5 py-3 text-sm font-medium w-full text-white ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-900"}`}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
