const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executePythonCode = async (filePath, inputPath) => {
  const outputPath = path.join(__dirname, "./Outputs");
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.txt`);

  try {
    const output = await new Promise((resolve, reject) => {
      const command = `python ${filePath} < ${inputPath} > ${outPath}`;
      exec(command, { timeout: 2000 }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            return reject(new Error("Time Limit Exceeded"));
          }
          return reject(new Error("Runtime Error"));
        }
        if (stderr) {
          return reject(new Error("Runtime Error"));
        }
        resolve(fs.readFileSync(outPath, "utf8"));
      });
    });

    return output;
  } catch (error) {
    return `${error.message}`;
  }
};

module.exports = { executePythonCode };
