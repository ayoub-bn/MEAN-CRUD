import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide unique username"],
        unique: [true, "username already exists"]
    },

    password: {
        type: String,
        required: [true, "please provide a password"],
        unique: false
    },
    email:{
        type:String,
        required:[true,"please provide an email"],
        unique:true
    },
    firstName:{type:String},
    lastName:{type:String},
    number:{type:Number},
    adress:{type:String},
    profile:{type:String}
})


export default mongoose.model.Users || mongoose.model('User',userSchema)