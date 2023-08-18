const URL="mongodb+srv://admin:admin123@cluster0.dej7qho.mongodb.net/userdb?retryWrites=true&w=majority";

import mongoose from 'mongoose';
const promise=mongoose.connect(URL);
promise.then(data=>{
    console.log("DB connected ...");
})
.catch(err=>{
    console.log("error in connection ",err);
})
export default mongoose;