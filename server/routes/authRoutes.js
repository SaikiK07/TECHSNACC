import express from 'express'
import { login, register ,adminLogin, listUser, removeUser, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, verifyResetOtp, googleLogin} from '../controllers/authController.js'
import adminAuth from '../middlewares/adminAuth.js'
import userauth from '../middlewares/userauth.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userauth,sendVerifyOtp)
authRouter.post('/verify-account',userauth,verifyEmail)
authRouter.get('/is-auth',userauth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/verify-reset-otp',verifyResetOtp)
authRouter.post('/reset-password',resetPassword)
authRouter.post('/admin',adminLogin)
authRouter.get('/listuser',listUser)
authRouter.post('/userremove',adminAuth,removeUser)
authRouter.post('/googlelogin', googleLogin);
authRouter.get('/test', (req, res) => {
  res.send('Working');
});

export default authRouter