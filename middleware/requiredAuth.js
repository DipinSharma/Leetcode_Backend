import  jwt  from "jsonwebtoken";
import { userModel } from "../db/models/user-schema.js";
export const requireAuth=async (req,res,next)=>{

    // verify authentication
    const {authorization}=req.headers;
    console.log(authorization)
    if(!authorization){
        return res.status(401).json({error:"Authorization token required"});
    }
    const token=authorization.split(' ')[1];
    try{
        const _id=jwt.verify(token,process.env.SECRET);
        req.user=await userModel.findOne({_id}).select("_id");
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error:"request is not authorized"});
    }

}