const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { exec } = require("child_process");

const generateFile = (language, code) => {
    const dirCodes = path.join(__dirname, 'codes');

    if (!fs.existsSync(dirCodes)) {
        fs.mkdirSync(dirCodes, { recursive: true });
    }

    const jobId = uuid();
    let filename, filePath;

    switch (language) {
        case 'cpp':
            filename = `${jobId}.cpp`;
            break;
        case 'java':
            filename = `${jobId}.java`;
            break;
        case 'python':
            filename = `${jobId}.py`;
            break;
        case 'javascript':
            filename = `${jobId}.js`;
            break;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }

    filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, code);

    return filePath;
};

const executeCode = (filePath, inputPath, timeLimit) => {
    const outputPath = path.join(__dirname, "outputs");
  
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
  
    const jobId = path.basename(filePath, path.extname(filePath));
  
    let command;
    switch (path.extname(filePath)) {
      case '.cpp':
        const outPathCpp = path.join(outputPath, `${jobId}.exe`);
        command = `g++ ${filePath} -o ${outPathCpp} && ${outPathCpp} < ${inputPath}`;
        break;
      case '.java':
        command = `javac ${filePath} && java -cp ${outputPath} ${jobId} < ${inputPath}`;
        break;
      case '.py':
        command = `python ${filePath} < ${inputPath}`;
        break;
      case '.js':
        command = `node ${filePath} < ${inputPath}`;
        break;
      default:
        return Promise.reject(new Error("Unsupported file type"));
    }
  
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Time Limit Exceeded"));
      }, timeLimit * 1000); // Convert time limit from seconds to milliseconds
  
      exec(command, (error, stdout, stderr) => {
        clearTimeout(timeout); // Clear the timeout when the command finishes executing
  
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      });
    });
  };

const generateInputFile = async (input) => {
    const dirInputs = path.join(__dirname, 'inputs');

    if (!fs.existsSync(dirInputs)) {
        fs.mkdirSync(dirInputs, { recursive: true });
    }

    const jobId = uuid();
    const inputFilename = `${jobId}.txt`;
    const inputFilePath = path.join(dirInputs, inputFilename);
    fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
};

module.exports.runCode = async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(500).json({ success: false, error: "Empty code body!" });
    }

    try {
        const filePath = generateFile(language, code);
        const inputPath = await generateInputFile(input);
        const output = await executeCode(filePath, inputPath, 5);
        res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
