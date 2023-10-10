import { SchemaTypes } from "mongoose";
import mongoose from "../connection.js";
const Schema=mongoose.Schema;
const userSchema=new Schema({
    'email':{type:SchemaTypes.String,required:true,unique:true},
    'password':{type:SchemaTypes.String,required:true,minLength:3},
    'name':{type:SchemaTypes.String,required:true},
    'phone':{type:SchemaTypes.String}
});

export const userModel=mongoose.model('users',userSchema);

