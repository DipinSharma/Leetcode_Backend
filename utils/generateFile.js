import { fileURLToPath } from 'url';
import path from 'path';
import fs from "fs";
import { v4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.join(__dirname, "..");
const dirCodes = path.join(parentDir, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
export const generateFile = async (format, code) => {
  const jobId = v4();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, code);
  return filePath;
};
