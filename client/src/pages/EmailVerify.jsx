import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = useRef([]);

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const otp = inputRefs.current.map((el) => el.value).join('');

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
        setOtpError(true);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setOtpError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-4'>
      <form
        onSubmit={onSubmitHandler}
        className='bg-slate-900/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md text-sm'
      >
        <h1 className='text-white text-2xl font-semibold text-center mb-2'>Verify Your Email</h1>
        <p className='text-center mb-6 text-indigo-300'>
          Enter the 6-digit code sent to your registered email address.
        </p>

        <div className='flex justify-between mb-6' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type='text'
              inputMode='numeric'
              maxLength='1'
              required
              autoFocus={index === 0}
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`OTP Digit ${index + 1}`}
              className={`w-11 h-12 sm:w-12 sm:h-12 text-white text-center text-xl rounded-md outline-none border transition-all duration-200 ${
                otpError ? 'border-red-500' : 'border-gray-600'
              } bg-[#333A5C] focus:ring-2 focus:ring-indigo-500`}
            />
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-full transition-all duration-300 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:opacity-90'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className='text-center text-xs text-gray-400 mt-4'>
          Didn't receive the code?{' '}
          <span
            onClick={() => toast.info('OTP resend not implemented')}
            className='text-indigo-300 hover:underline cursor-pointer'
          >
            Resend OTP
          </span>
        </div>
      </form>
    </div>
  );
};

export default EmailVerify;
