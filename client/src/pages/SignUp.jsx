import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

const SignUp = () => {
  const { backendUrl, token, setToken, setIsLoggedin, getUserData } = useContext(ShopContext);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, username, email, password, confirmPassword } = form;

    if (!name || !username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        username,
        email,
        password,
        captcha: captchaValue
      });

      if (res.data.success) {
        setToken(res.data.token);
        setIsLoggedin(true);
        getUserData();
        localStorage.setItem('token', res.data.token);
        toast.success("Registered successfully!");
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (token) navigate('/login');
  }, [token]);

  return (
    <div className="mt-16">
      <section className="flex flex-wrap lg:items-center">
        <div
          className="relative lg:h-[600px] h-96 w-full lg:w-1/2 bg-image text-white rounded-3xl"
          style={{
            backgroundImage: `url(${assets.h5})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-5xl mb-4 lg:mt-60 mt-36 prata-regular">TECHSNACC</h1>
            <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Saiki Accessories Portal</h1>
          </div>
        </div>

        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4 mt-14 text-green-800 hover:text-green-900">
              SIGN UP
            </h1>
          </div>

          <form onSubmit={onSubmitHandler} className="mx-auto mt-8 max-w-md space-y-4">
            {["name", "username", "email", "password", "confirmPassword"].map((field, idx) => (
              <div key={idx}>
                <label className="input input-bordered flex items-center gap-2 rounded-full">
                  <input
                    name={field}
                    type={
                      field === "password" || field === "confirmPassword"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("Password", " Password")}
                    className="grow"
                    value={form[field]}
                    onChange={handleChange}
                  />
                </label>
              </div>
            ))}

            <ReCAPTCHA
              sitekey="6LcDBe8qAAAAAHiq8sQObi-6Qd2Gkq58H1GhODKO"
              onChange={(val) => setCaptchaValue(val)}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Already have an account?
                <Link to="/login" className="text-blue-600 ml-1 underline">Login here</Link>
              </p>
            </div>

            <button
              type="submit"
              className={`inline-block rounded-full bg-green-800 hover:bg-green-900 px-5 py-3 text-sm font-medium text-white w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
