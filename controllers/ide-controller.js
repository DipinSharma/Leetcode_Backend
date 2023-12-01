import { ExampleModel } from "../db/models/ExampleSchema.js";
import { jobModel } from "../db/models/jobSchema.js";
import { QuestionModel } from "../db/models/questionSchema.js";
import compiler from 'compilex';

var options = { stats: true }; //prints stats on console 
compiler.init(options);

export const ideController = {
  async compile(request, response) {
    const { language, code, testCases, questionNumber } = request.body;

    if (code === undefined) {
      return response.status(400).json({ success: false, error: "empty code !!" });
    }

    try {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      const outputs = await Promise.all(testCases.map(async (input) => {
        return new Promise((resolve, reject) => {
          compiler.compileCPPWithInput(envData, code, input, function (data) {
            if (data.error) {

              reject(new Error(data.error));
            } else {
              resolve(data);
            }
          });
        });
      }));

      const doc = await QuestionModel.findOne({ number: questionNumber });
      const expected = await Promise.all(testCases.map(async (input) => {
        return new Promise((resolve) => {
          compiler.compileCPPWithInput(envData, doc.solution, input, function (data) {
            resolve(data);
          });
        });
      }));

      compiler.flushSync();
      
      response.send({ success: true, outputs: outputs, expected: expected });
      
    } catch (err) {
      compiler.flush(function () {
        console.log('All temporary files flushed !');
      });
      if (err instanceof Error) {
        return response.status(200).json({ success: false, error: "Compilation Error", details: err.message });
      }
      return response.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },

  async submit(request, response) {
    const { language, code, questionNumber } = request.body;

    if (code === undefined) {
      return response.status(400).json({ success: false, error: "empty code !!" });
    }

    try {
      const doc = await QuestionModel.findOne({ number: questionNumber });
      const testCases=doc.solutionTestCases;
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      const outputs = await Promise.all(testCases.map(async (input) => {
        return new Promise((resolve, reject) => {
          compiler.compileCPPWithInput(envData, code, input, function (data) {
            if (data.error) {

              reject(new Error(data.error));
            } else {
              resolve(data);
            }
          });
        });
      }));

      const expected = await Promise.all(testCases.map(async (input) => {
        return new Promise((resolve) => {
          compiler.compileCPPWithInput(envData, doc.solution, input, function (data) {
            resolve(data);
          });
        });
      }));
      let allValuesMatch =true;
      let index=-1;
      outputs.map((item,index)=>{
        if(item.output!=expected[index].output){
          allValuesMatch=false;
        }
      })

      response.send({success: allValuesMatch, input:testCases[index],outputs:outputs.output,expected:expected.output });

    } catch (err) {
      if (err instanceof Error) {
        return response.status(200).json({ success: false, error: "Compilation Error", details: err.message });
      }
      return response.status(500).json({ success: false, error: "Internal Server Error" });
    }

  },

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
        const { name, number, description, testCases, outputs, expected } = doc;
        res.status(200).json({ name, number, description, examples, testCases, outputs, expected });
      }
    } catch (err) {
      res.status(400).json({ error: "internal error" });
    }
  },

  async allQuestions(req, res) {
    try {
      const doc = await QuestionModel.find();
      if (doc == null) {
        res.send(400).json({ error: "no questions found" });
      }
      else {
        res.status(200).json(doc);
      }
    }
    catch (err) {
      res.status(400).json({ error: "internal error" });
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
      data.examples = examples;
      try {
        const job = await new QuestionModel(data).save();
        res.status(200).json(job);
      } catch (err) {
        res.status(400).json({ error: JSON.stringify(err) });
      }
    } catch (err) {
      res.status(400).json({ error: JSON.stringify(err) });
    }
  },
};
// async getStatus(req, res) {
//   const jobId = req.query.id;
//   console.log("status requested ", jobId);
//   if (jobId === undefined) {
//     return res
//       .status(400)
//       .json({ success: false, error: "missing id Query param" });
//   }
//   try {
//     const job = await jobModel.findById(jobId);
//     if (job === undefined) {
//       return res
//         .status(400)
//         .json({ success: false, error: "invalid job ID" });
//     }
//     return res.status(200).json({ success: true, job });
//   } catch (err) {
//     return res
//       .status(400)
//       .json({ success: false, error: JSON.stringify(err) });
//   }
// },




// async compile(request, response) {
  //   const { language, code, testCases, questionNumber } = request.body;
  //   console.log(code, questionNumber)
  //   if (code === undefined) {
    //     return response.status(400).json({ success: false, error: "empty code !!" });
    //   }
    
    //   try {
      //     var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      //     const compilePromises = testCases.map((input) => {
        //       return new Promise(async (resolve) => {
          //         try {
//           const compileResult = await compileWithInput(envData, code, input);
//           resolve(compileResult);
//         } catch (compileError) {
//           resolve({ error: compileError });
//         }
//       });
//     });

//     const outputs = await Promise.all(compilePromises);
//     const doc = await QuestionModel.findOne({ number: questionNumber });

//     const expectedPromises = testCases.map((input) => {
//       return new Promise(async (resolve) => {
//         try {
//           const expectedResult = await compileWithInput(envData, doc.solution, input);
//           resolve(expectedResult);
//         } catch (compileError) {
//           resolve({ error: compileError });
//         }
//       });
//     });

//     const expected = await Promise.all(expectedPromises);

//     response.send({ outputs, expected });
//     //   const filePath = await generateFile(language, code);
//     //   const jobId = (await new jobModel({ language, filePath }).save())["_id"];
//     //   response.status(201).json({ success: true, jobId });

//     //   // const executionResults = await Promise.all(testCases.map(async (input, index) => {
//     //     const job = new jobModel({ language, filePath }); // Create a new instance for each test case
//     //     job["startedAt"] = new Date();
//     //     const output = await executeCpp(filePath, testCases[0]);
//     //     job["completedAt"] = new Date();
//     //     job["status"] = "success";
//     //     job["output"] = output;
//     //     await job.save();
//     //     return { input:testCases[0], output, status: "success" };
//     //   // }));

//     //   console.log(executionResults);
//   } catch (err) {
//     console.error(err);
//     return response.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// },