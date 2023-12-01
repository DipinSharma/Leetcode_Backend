import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const createToken=(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'});
}
