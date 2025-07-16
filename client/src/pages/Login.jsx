import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Login = () => {
  const { backendUrl, setToken, setIsLoggedin, getUserData } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const authToken = response.data.token;
        localStorage.setItem('token', authToken);
        axios.defaults.headers.common['token'] = authToken;
        setToken(authToken);
        await getUserData(authToken);
        setIsLoggedin(true);
        toast.success("Login successful");
        navigate('/');
      } else {
        toast.error(response.data.message || "Login failed.");
        setIsLoggedin(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login request failed.");
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      const res = await axios.post(backendUrl + '/api/auth/googlelogin', {
        email,
        name
      });

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['token'] = token;
        setToken(token);
        await getUserData(token);
        setIsLoggedin(true);
        toast.success("Google Login successful");
        navigate('/');
      } else {
        toast.error(res.data.message || "Google login failed.");
      }
    } catch (err) {
      toast.error("Google login failed.");
    }
  };

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleSuccess
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 300 // number only, not "100%"
      });

      // Remove One Tap (optional)
      // window.google.accounts.id.prompt(); // ❌ not needed if you only want the button
    }
  }, []);

  return (
    <div>
      <section className="relative flex flex-wrap lg:items-center mt-16">
        {/* Left */}
        <div
          className="relative lg:h-[600px] h-96 w-full lg:w-1/2 bg-image text-white rounded-3xl"
          style={{ backgroundImage: `url(${assets.h5})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-5xl mb-4 lg:mt-60 mt-36 prata-regular">TECHSNACC</h1>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Saiki Accessories Portal</h1>
          </div>
        </div>

        {/* Right */}
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4 lg:mt-24 mt-14 text-green-800 hover:text-green-900">LOGIN</h1>
          </div>

          <form onSubmit={onSubmitHandler} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <label className="input input-bordered flex items-center gap-2 rounded-full">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Email or Username"
                autoComplete="email"
                className="grow"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 rounded-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className="grow"
              />
            </label>

            <ReCAPTCHA
              sitekey="6LeqdYUrAAAAAJnldJrzjkAR__EXQv9odCTG6OV8"
              onChange={(value) => setCaptchaValue(value)}
            />

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span onClick={() => navigate('/reset-password')} className="cursor-pointer hover:text-blue-600">
                Forgot password?
              </span>
              <span>
                Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-block rounded-full px-5 py-3 text-sm font-medium w-full text-white ${loading ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-900'}`}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>

            {/* Google Login */}
            <div className="text-center mt-6">
              <p className="mb-2 text-gray-500">Or login with Google</p>
              <div ref={googleBtnRef} className="flex justify-center" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
