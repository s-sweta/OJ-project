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

    if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.exe`
    const outPath = path.join(outputPath, outputFilename);

    return new Promise ((resolve, reject) => {
        exec(`g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${outputFilename}`, 
        (error, stdout, stderr) => {
                if(error) {
                    reject(error);
                }
                if(stderr){
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
        const output = await executeCpp(filePath);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } 
}