import { Router } from "express";
import { completedTasks, login, signUp, tasks, updateStatus, userData } from "../controllers/userController";
import { userAuth } from "../authentication/userAuth";
const userRouter = Router()


userRouter.post('/login',(req,res)=>login(req,res))
userRouter.post('/signup',(req,res)=>signUp(req,res))
userRouter.get('/userdata',userAuth,(req,res)=>userData(req,res))
userRouter.get('/taskdata',userAuth,(req,res)=>tasks(req,res))
userRouter.put('/updatestatus',userAuth,(req,res)=>updateStatus(req,res))
userRouter.get('/completedtasks',userAuth,(req,res)=>completedTasks(req,res))

export default userRouter