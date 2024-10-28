import mongoose from "mongoose"

export interface User {
    _id:string
    name:string,
    email:string,
    password:string
}

export interface Task{
    userId:mongoose.Schema.Types.ObjectId|string,
    taskname:string
    startdate:string,
    enddate:string,
    status?:string
}