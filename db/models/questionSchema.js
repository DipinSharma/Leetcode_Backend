import mongoose from "../connection.js";
import { ExampleModel } from "./ExampleSchema.js";
const Schema=mongoose.Schema;
const questionSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    examples:[{type:Schema.Types.ObjectId,ref:'example'}]
});

export const QuestionModel=mongoose.model('question',questionSchema);

