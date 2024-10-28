import Jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const secretKey =process.env.SECRETKEY as string
export const jwtToken = async(user_id:string)=>{
    try {
        const payload ={user_id:user_id}
        const token = Jwt.sign(payload,secretKey,{expiresIn:'1d'})
        return token
    } catch (error) {
        console.error("Failed to generate token");
        
    }
}