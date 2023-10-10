import mongoose from "../connection.js";
const Schema=mongoose.Schema;
const exampleSchema=new Schema({
    input:{
        type:String,
        required:true
    },
    output:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    explanation:{
        type:String
    }
});

export const ExampleModel=mongoose.model('example',exampleSchema);

