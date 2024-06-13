const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeCPPCode = async (filePath, inputPath) => {
  const outputPath = path.join(__dirname, "./Outputs");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const compileCommand = `g++ ${filePath} -o ${outPath}`;
    const runCommand = `${outPath} < ${inputPath}`;

    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject(new Error("Compilation Error: " + compileStderr));
      }

      exec(`chmod +x ${outPath}`, (chmodError) => {
        if (chmodError) {
          return reject(new Error("Failed to set executable permissions"));
        }

        exec(runCommand, (runError, runStdout, runStderr) => {
          if (runError) {
            return reject(new Error("Runtime Error: " + runStderr));
          }
          if (runStderr) {
            return reject(new Error("Runtime Error: " + runStderr));
          }
          resolve(runStdout);
        });
      });
    });
  });
};

module.exports = { executeCPPCode };
