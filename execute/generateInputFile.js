const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const generateInputFile = async (input) => {
    const dirInputs = path.join(__dirname, "./Inputs");
    if (!fs.existsSync(dirInputs)) {
      fs.mkdirSync(dirInputs, { recursive: true });
    }
    const jobId = uuid();
    const inputFileName = `${jobId}.txt`;
    const inputFilePath = path.join(dirInputs, inputFileName);
    await fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
  };
  module.exports={generateInputFile};