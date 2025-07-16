import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../modles/userModel.js'
import validator from "validator"
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'


const createToken =(id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'3d'})
}

//register
export const register = async (req ,res) =>{
    const {name,username,email,password} =req.body

    
    try {

        const existingUser =await userModel.findOne({email})

        if(existingUser){
            return res.json({success: false, message: 'Email already exists'})
        }
        if(!validator.isEmail(email)){
            return res.json({success: false, message: 'Invalid email'})
        }
        if(password.length < 8){
            return res.json({success: false, message: 'Please enter a strong password'})
        }

        const hashedPassword =await bcrypt.hash(password,10)

        const user = new userModel({name,username,email,password: hashedPassword})
        await user.save()

        const token = createToken(user._id)

        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production',
            'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //sending welcome email
        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome To Saiki Accessories',
            text: `Welcome to TECHSNACC website. Your account has been created with email id: ${email} `
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true,token})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//login
// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email }, { username: email }]
    });

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid Password' });
    }

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//logout
export const logout = async(req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production',
            'none': 'strict'
        })
        return res.json({success:true,message:'Logout'})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//send verification otp to the user's email
export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId)
        if (user.isAccountVerified) {
            return res.json({success:false,message:"Account Already verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}.Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOption)
        res.json({success:true,message:'Verification OTP Sent on Email'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Verify the email using otp
export const verifyEmail = async(req,res)=>{
    const {userId,otp} = req.body

    if (!userId || !otp) {
        res.json({success:false,message:'Missing Details'})
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success:false,message:'User not Found'})
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success:false,message:'Invalid OTP'})
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success:false,message:'OTP Expired'})
        }
        user.isAccountVerified = true
        user.verifyOtp=''
        user.verifyOtpExpireAt = 0

        await user.save()
        return res.json({success:true,message:'Email Verified Successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//check if user is authenticated
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success:true})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//send password reset otp
export const sendResetOtp = async(req,res)=>{
    const {email} = req.body
    if (!email) {
        return res.json({success:false,message:'Email is required'})
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success:false,message:'User not Found'})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `Your OTP for resetting your password is ${otp}.
            //use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOption)

        return res.json({success:true,message:'OTP sent to your email'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//reset user password
export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body
    if (!email || !otp || !newPassword) {
        return res.json({success:false,message:'Email , OTP and new password are required'})
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success:false,message:'User not Found'})
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({success:false,message:'Invalid OTP'})
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success:false,message:'OTP has expired'})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()
        
        return res.json({success:true,message:'Password reset successfully'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: 'User not found' });
      }
      if (user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: 'Invalid or expired OTP' });
      }
      return res.json({ success: true, message: 'OTP Verified' });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
  

//admin login
export const adminLogin =async (req,res) => {

    try {
        
        const {email,password} =req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        
        return res.json({success: false, message: error.message})

    }

}

// user list
export const listUser = async (req, res) => {
    
    try {
        
        const user = await userModel.find({})
        res.json({success:true,user})

    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})

    }

}

//remove user
export const removeUser = async (req, res) => {

    try {
        
        await userModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"User Removed"})

    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})

    }

}


export const googleLogin = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
      const dummyPassword = await bcrypt.hash(email + process.env.JWT_SECRET, 10);

      user = new userModel({
        name,
        email,
        username: generatedUsername,
        password: dummyPassword,
        isAccountVerified: true
      });

      await user.save();
    }

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
