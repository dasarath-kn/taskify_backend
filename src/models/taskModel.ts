import mongoose, { Schema } from "mongoose";
import { Task } from "../interface/userInterface";

const taskSchema:Schema<Task> =new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    taskname:{
        type:String,
        required:true
    },
    startdate:{
        type:String,
        required:true
    },
    enddate:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    }
})
const taskModel = mongoose.model('task',taskSchema)
export default taskModel