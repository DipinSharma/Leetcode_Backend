import { stringify } from "uuid";
import { ExampleModel } from "../db/models/ExampleSchema.js";
import { jobModel } from "../db/models/jobSchema.js";
import { QuestionModel } from "../db/models/questionSchema.js";
import { executeCpp } from "../utils/executeCpp.js";
import { generateFile } from "../utils/generateFile.js";
import { json } from "express";

export const ideController = {
  async compile(request, response) {
    const { language, code } = request.body;
    if (code === undefined) {
      return response
        .status(400)
        .json({ success: false, error: "empty code !!" });
    }
    let job;
    try {
      const filePath = await generateFile(language, code);
      job = await new jobModel({ language, filePath }).save();
      let output;

      const jobId = job["_id"];
      response.status(201).json({ success: true, jobId });

      job["startedAt"] = new Date();
      output = await executeCpp(filePath);
      job["completedAt"] = new Date();
      job["status"] = "success";
      job["output"] = output;
      await job.save();
      //   console.log(job);
    } catch (err) {
      job["completedAt"] = new Date();
      job["status"] = "error";
      job["output"] = JSON.stringify(err);
      await job.save();
      //   console.log(job);
      // return response.json({err});
    }
  },
  submit() {},

  async question(req, res) {
    const questionName = req.params;
    try {
      // console.log(questionName);
      // const doc=await QuestionModel.findOne({name:questionName});
      const doc = await QuestionModel.findOne({ name: questionName.question });
      if (doc === null) {
        res.status(400).json({ error: "question not found" });
      } else {
        const examples = await ExampleModel.find({ _id: doc.examples });
        const { name, number, description } = doc;
        res.status(200).json({ name, number, description, examples });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "internal error" });
    }
  },

  questions() {},

  async getStatus(req, res) {
    const jobId = req.query.id;
    console.log("status requested ", jobId);
    if (jobId === undefined) {
      return res
        .status(400)
        .json({ success: false, error: "missing id Query param" });
    }
    try {
      const job = await jobModel.findById(jobId);
      if (job === undefined) {
        return res
          .status(400)
          .json({ success: false, error: "invalid job ID" });
      }
      return res.status(200).json({ success: true, job });
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, error: JSON.stringify(err) });
    }
  },
  async addProblem(req, res) {
    const data = req.body;
    const examples = [];
    try {
      const createdExamples = await Promise.all(
        data.examples.map(async (exampleData) => {
          const example = await ExampleModel.create(exampleData);
          examples.push(example._id);
          return example;
        })
        );
        data.examples=examples;
        try{
          const job=await new QuestionModel(data).save();
          res.status(200).json(job);
        }catch(err){
          res.status(400).json({error:JSON.stringify(err)});
        }
    } catch (err) {
      res.status(400).json({ error: JSON.stringify(err) });
    }
  },
};
