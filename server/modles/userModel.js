import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String ,required:true},
    username: {type:String ,required:true},
    email: {type:String ,required:true, unique: true},
    password: {type:String ,required:true},
    verifyOtp: {type:String ,default: ''},
    verifyOtpExpireAt: {type:Number ,default: 0},
    isAccountVerified: {type:Boolean ,default: false},
    resetOtp: {type:String ,default: ''},
    resetOtpExpireAt: {type:Number ,default: 0},
    cartData: { type: Object , default: {}}
},{minimize:false})

const userModel =mongoose.models.user || mongoose.model('user',userSchema)

export default userModel