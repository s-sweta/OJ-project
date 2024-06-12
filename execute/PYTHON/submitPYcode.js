const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const submitPythonCode = async (filePath, testcases) => {
  const outputPath = path.join(__dirname, "./Outputs");
  const inputPath = path.join(__dirname, "./Inputs");
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  if (!fs.existsSync(inputPath)) {
    fs.mkdirSync(inputPath, { recursive: true });
  }
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.txt`);
  const inPath = path.join(inputPath, `${jobId}.txt`);

  try {
    for (let i = 0; i < testcases.length; i++) {
      const { input, expectedOutput } = testcases[i];
      await fs.promises.writeFile(inPath, input);
      const output = await new Promise((resolve, reject) => {
        const command = `python ${filePath} < ${inPath} > ${outPath}`;
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

      if (output.trim() !== expectedOutput.trim()) {
        return "Wrong Answer";
      }
    }

    return "Accepted";
  } catch (error) {
    return `${error.message}`;
  }
};

module.exports = { submitPythonCode };
