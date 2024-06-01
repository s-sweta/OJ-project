const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');
const { exec } = require("child_process");

const generateFile = (language, code) => {
    const dirCodes = path.join(__dirname, 'codes');

    if(!fs.existsSync(dirCodes)){
        fs.mkdirSync(dirCodes, {recursive: true});
    }

    const jobId = uuid();
    let filename, filePath;
  
    switch (language) {
      case 'cpp':
        filename = `${jobId}.cpp`;
        filePath = path.join(dirCodes, filename);
        fs.writeFileSync(filePath, code);
        break;
      case 'java':
        filename = `${jobId}.java`;
        filePath = path.join(dirCodes, filename);
        fs.writeFileSync(filePath, code);
        break;
      case 'python':
        filename = `${jobId}.py`;
        filePath = path.join(dirCodes, filename);
        fs.writeFileSync(filePath, code);
        break;
      case 'javascript':
        filename = `${jobId}.js`;
        filePath = path.join(dirCodes, filename);
        fs.writeFileSync(filePath, code);
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  
    return filePath;
  };

  const executeCode = (filePath) => {
    const outputPath = path.join(__dirname, "outputs");

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(outputPath, outputFilename);

    let command;
    if (filePath.endsWith(".cpp")) {
        command = `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}`;
    } else if (filePath.endsWith(".java")) {
        command = `javac ${filePath} && java -cp ${outputPath} ${jobId}`;
    } else if (filePath.endsWith(".py")) {
        command = `python ${filePath}`;
    } else if (filePath.endsWith(".js")) {
        command = `node ${filePath}`;
    } else {
        return Promise.reject(new Error("Unsupported file type"));
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
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

module.exports.runCode = async (req, res) => {
    const {language = 'cpp', code} = req.body;
    if(code === undefined) {
        return res.status(500).json({success: false, error: "Empty code body!"});
    }

    try {
        const filePath = generateFile(language, code);
        const output = await executeCode(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } 
}