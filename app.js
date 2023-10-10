import  express  from "express";
import { userRoutes } from "./routes/user-routes.js";
import { ideRoutes } from "./routes/ide-routes.js";
import cors from 'cors';
const app=express();
app.use(express.json());
app.use(cors());
app.use('/',userRoutes);
app.use('/',ideRoutes);
// last m iddleware(404)
app.use((request,response,next)=>{
    response.json({message:"invalid URL"})
})
const server=app.listen(1234,(err)=>{
    if(err){
        console.log("server crash ",err);
    }
    else{
        console.log("server up and running", server.address().port)
    }
})