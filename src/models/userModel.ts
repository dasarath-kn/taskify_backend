import mongoose, { Schema } from "mongoose";
import { User } from "../interface/userInterface";

const userSchema:Schema<User> = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const UserModel = mongoose.model('user',userSchema)
export default UserModel