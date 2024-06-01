const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true});
}

const generateFile = (language, code) => {
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


module.exports = {
    generateFile,
};