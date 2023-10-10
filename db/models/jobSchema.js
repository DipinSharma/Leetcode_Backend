import { SchemaTypes } from "mongoose";
import mongoose from "../connection.js";
const Schema=mongoose.Schema;
const jobSchema=new Schema({
    language:{
        type:String,
        required:true,
        enum:["cpp"]
    },
    filePath:{
        type:String,
        required:true
    },
    submittedAt:{
        type:Date,
        default:Date.now
    },
    startedAt:{
        type:Date
    },
    completedAt:{
        type:Date
    },
    output:{
        type:String
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","success","error"]
    }
});

export const jobModel=mongoose.model('job',jobSchema);

