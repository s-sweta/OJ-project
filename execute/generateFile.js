const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const generateFile = async (format, code) => {
  const dirCodes = path.join(__dirname, "./Codes");
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
  }
  const jobId = uuid();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, code);
  return filePath;
};
module.exports={generateFile}