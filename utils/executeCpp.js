import { fileURLToPath } from 'url';
import {exec} from 'child_process';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.join(__dirname, "..");
const outPutPath = path.join(parentDir, "outputs");

if(!fs.existsSync(outPutPath)){
    fs.mkdirSync(outPutPath,{recursive:true});
}

export const executeCpp=(filePath)=>{
    const jobId=path.basename(filePath).split(".")[0];
    const outPath=path.join(outPutPath,`${jobId}.exe`);
    return new Promise((resolve,reject)=>{
        exec(`g++ ${filePath} -o ${outPath} && cd ${outPutPath} && ${jobId}.exe`,(error,stdout,stderr)=>{
            error && reject({error,stderr});
            stderr && reject({stderr});
            resolve(stdout);
        })
    })
}