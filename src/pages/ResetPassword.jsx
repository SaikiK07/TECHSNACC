import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} = useContext(ShopContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent,setIsEmailSent] = useState('')
  const [otp,setOtp] = useState(0)
  const [isOtpSubmited,setIsOtpSubmited] = useState(false)

  const inputRefs = React.useRef([])
  
    const handleInput =(e,index)=>{
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus()
      }
    }
  
    const handleKeyDown = (e,index) =>{
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  
    const handlePaste =(e)=>{
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('')
      pasteArray.forEach((char,index)=>{
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char
        }
      })
    }

    const onSubmitEmail = async(e)=>{
      e.preventDefault()
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const enteredOtp = otpArray.join('');
    
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/verify-reset-otp', { email, otp: enteredOtp });
    
        if (data.success) {
          setOtp(enteredOtp);
          setIsOtpSubmited(true);
          toast.success("OTP Verified");
        } else {
          toast.error("Invalid OTP. Please try again.");
        }
      } catch (error) {
        toast.error("Error verifying OTP");
      }
    };
    

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
    
      // Simple length check
      if (newPassword.length < 8) {
        return toast.error("Password must be at least 8 characters long.");
      }
    
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
          email,
          otp,
          newPassword,
        });
    
        data.success ? toast.success(data.message) : toast.error(data.message);
        data.success && navigate('/login');
      } catch (error) {
        toast.error(error.message);
      }
    };
    

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
        
      {/*enter email id */}
      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#434e85]'>
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
          <input value={email} onChange={e => setEmail(e.target.value)} required className='text-white bg-transparent outline-none' type="email" placeholder='Email id' />
        </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>
        }

      {/*otp input form*/}
      {!isOtpSubmited && isEmailSent && 
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input onInput={(e)=> handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)} ref={e => inputRefs.current[index] = e} type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' />
          ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
      </form> 
      }

      {/*enter new password */}
      {isOtpSubmited && isEmailSent && 
      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#434e85]'>
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
          <input value={newPassword} onChange={e => setNewPassword(e.target.value)} required className='text-white bg-transparent outline-none' type="password" placeholder='New password' />
        </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>
        }

    </div>
  )
}

export default ResetPassword