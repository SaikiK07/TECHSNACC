import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  axios.defaults.withCredentials = true
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      toast[data.success ? 'success' : 'error'](data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const otpArray = inputRefs.current.map(e => e.value)
    const enteredOtp = otpArray.join('')
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-reset-otp', { email, otp: enteredOtp })
      if (data.success) {
        setOtp(enteredOtp)
        setIsOtpSubmited(true)
        toast.success("OTP Verified")
      } else {
        toast.error("Invalid OTP")
      }
    } catch (error) {
      toast.error("Error verifying OTP")
    } finally {
      setLoading(false)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      setLoading(false)
      return
    }
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword
      })
      toast[data.success ? 'success' : 'error'](data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
          <input className='w-full mb-4 p-3 rounded-full' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button disabled={loading} className='w-full py-2.5 bg-blue-700 text-white rounded-full'>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      {!isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>OTP Verification</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit OTP sent to your email</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input key={index} type="text" maxLength="1" required
                     onInput={(e) => handleInput(e, index)}
                     onKeyDown={(e) => handleKeyDown(e, index)}
                     ref={el => inputRefs.current[index] = el}
                     className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' />
            ))}
          </div>
          <button disabled={loading} className='w-full py-3 bg-blue-700 text-white rounded-full'>
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      )}

      {isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <input className='w-full mb-4 p-3 rounded-full' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button disabled={loading} className='w-full py-2.5 bg-blue-700 text-white rounded-full'>
            {loading ? 'Updating...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword
