import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const promise=mongoose.connect(process.env.URL);
promise.then(data=>{
    console.log("DB connected ...");
})
.catch(err=>{
    console.log("error in connection ",err);
})
export default mongoose;