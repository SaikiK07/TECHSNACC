import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({

    username: {type:String ,required:true},
    email: {type:String ,required:true},
    subject: {type:String ,required:true},
    message: {type:String ,required:true},

})

const contactModel =mongoose.models.contact || mongoose.model('contact',contactSchema)

export default contactModel