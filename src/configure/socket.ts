
import { Server } from "socket.io";
import { Socket } from "socket.io";
import taskModel from "../models/taskModel";

export const initializeSocket = (server: any) => {
    const users: { [key: string]: string } = {};
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });    
    io.on('connection', (socket: Socket) => {
        console.log("Socket connected: ", socket.id);
        socket.on("user_login", (user_id) => {
            console.log("Socket turned on for user:", user_id);
        });
        socket.on('task',async(data,user_id)=>{
            if(data){
                data.userId =user_id
                console.log(data);
                const {taskname} =data
                const datas =await taskModel.findOne({taskname:taskname})
                if(datas){
                    socket.emit('task_failed', { message: "Task already successfully"});
   
                }else{
                
               const tasks= new taskModel(data)
                await tasks.save()
                    socket.emit('task_added', { message: "Task added successfully"});
                
            }}
            console.log(data,user_id);
            
        })
        socket.on('delete',async(taskId)=>{
            console.log(taskId);
            const remove = await taskModel.deleteOne({_id:taskId})
            if(remove.acknowledged){
                socket.emit("task_deleted",{message:"Task deleted successfully",taskId})
            }
            
        })
        socket.on('edit',async(taskId,data,userId)=>{
            const update = await taskModel.updateOne({_id:taskId},{$set:data})
            if(update.acknowledged){                
                 socket.emit("task_edited",{message:"Task edited successfully"})
            }
            
        })

        socket.on('disconnect', () => {
            console.log("Socket disconnected: ", socket.id);
        });
    });
};
