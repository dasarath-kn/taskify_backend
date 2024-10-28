import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const secretKey = process.env.SECRETKEY as string
export const userAuth =(req:Request,res:Response,next:NextFunction)=>{
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;     
       req.userId = decoded.user_id;
      return next() 
  } catch (error:any) {
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token has expired.' });
      } else {
          return res.status(400).json({ message: 'Invalid token.' });
      }
  }
        
}