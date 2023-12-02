import mongoose from "../connection.js";
const Schema = mongoose.Schema;
const questionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    solution:{
        type:Schema.Types.String,
        required:true
    },
    examples: [{ type: Schema.Types.ObjectId, ref: 'example' }],
    difficulty: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    testCases: [{
        type: Schema.Types.String,
        required: true
    }],
    outputs:[{
        type: Schema.Types.String,
    }],
    expected:[{
        type: Schema.Types.String,
    }],
    SubmitTestCases:[{
        type:Schema.Types.String,
        required:true
    }]
});

export const QuestionModel = mongoose.model('question', questionSchema);

