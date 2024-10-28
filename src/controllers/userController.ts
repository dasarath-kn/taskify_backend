import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { jwtToken } from "../configure/jwt";
import { User } from "../interface/userInterface";
import * as express from 'express';
import taskModel from "../models/taskModel";

declare global {
    namespace Express {
        interface Request {
            userId?: string; 
        }
    }}  
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const userData: User | null = await UserModel.findOne({ email: email, password: password })
        const token = await jwtToken(userData?._id as string)        
        if (userData) {
            const id=userData._id
            res.status(200).json({ success: true, message: "Userdata sent successfully",token,id })
        }else if(!userData){
            res.status(200).json({ success: false, message: "User not found" })
 
        }
         else {
            res.status(400).json({ success: false, message: "Failed to sent userdata" })
        }

    } catch (error) {
        console.error(error);

    }
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body, "ppp");
        let findUser = await UserModel.findOne({ email: email, password: password })
        if (!findUser) {
            const userData = { name, email, password }
            let saveUser = new UserModel(userData)
            let saved = await saveUser.save()
            if (saved) {
                res.status(200).json({ success: true, message: "Signup completed" })
            } else {
                res.status(400).json({ success: false, message: "Failed to save userdata" })
            }
        } else {
            res.status(200).json({ success: true, message: "User already exist" })

        }

    } catch (error) {
        console.error(error);

    }
}

export const userData = async(req:Request,res:Response)=>{
    try {
        const {userId}=req
        const userData = await UserModel.findOne({_id:userId})
        const taskCompletedCount = await taskModel.find({userId:userId,status:"Completed"}).countDocuments()       
        const taskPendingCount = await taskModel.find({userId:userId,status:"Pending"}).countDocuments()       
        const taskOngoingCount = await taskModel.find({userId:userId,status:"Ongoing"}).countDocuments()       
        console.log(taskCompletedCount,taskOngoingCount,taskPendingCount);
        const currentYear = new Date().getFullYear();
        
        const result = await taskModel.aggregate([
            { 
                $match: { status: 'Completed', enddate: { $regex: `^${currentYear}` } }
            },
            {
                $group: {
                    _id: { $month: { $dateFromString: { dateString: "$enddate" } } },
                    count: { $sum: 1 } 
                }
            },
            { 
                $sort: { _id: 1 }
            }
        ]);

        const monthlyCounts = Array(12).fill(0);

        result.forEach(item => {
            monthlyCounts[item._id - 1] = item.count; 
        });
        console.log(monthlyCounts);
        
        if(userData){
            res.status(200).json({success:true,message:"Userdata sent successfully",userData,taskCompletedCount,taskOngoingCount,taskPendingCount,monthlyCounts})
        }else{
            res.status(400).json({success:false,message:"Failed to sent userdata"})
        }
    } catch (error) {
        console.error(error);
        
    }
}

export const tasks = async(req:Request,res:Response)=>{
    try {
        const {userId} =req
        const taskData =await taskModel.find({userId:userId,status:{$ne:"Completed"}})
        if(taskData){
            res.status(200).json({success:true,message:"Taskdata sent successfully",taskData})
        }else{
            res.status(400).json({success:false,message:"Failed to sent task"})
        }
    } catch (error) {
        console.error(error);
        
    }
}

export const updateStatus =async(req:Request,res:Response)=>{
    try {
        const {taskId,status}=req.body        
        const updatestatus = await taskModel.updateOne({_id:taskId},{$set:{status:status}})
        if(updatestatus.acknowledged){
            res.status(200).json({success:true,message:"Status changed"})
        }else{
            res.status(400).json({success:false,message:"Failed to change status"})
        }
    } catch (error) {
      console.error(error);
        
    }
}

export const completedTasks =async(req:Request,res:Response)=>{
try {
    const {userId} =req
    console.log(userId);
    const completedTasks =await taskModel.find({userId:userId,status:{$eq:"Completed"}})
    console.log(completedTasks);
    if(completedTasks){
        
        res.status(200).json({success:true,message:"Completed task data sent successfully",completedTasks})
    }else{
        res.status(400).json({success:false,message:"Failed to sent completed tasks"})
    }
} catch (error) {
    console.error(error);

}
}