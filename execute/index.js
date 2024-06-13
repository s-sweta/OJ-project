const express = require("express");
const { generateFile } = require("./generateFile.js");
const { generateInputFile } = require("./generateInputFile.js");
const { executeCPPCode } = require("./CPP/executeCPPCode.js");
const { submitCppCode } = require("./CPP/submitCPPcode.js");
const {executePythonCode} = require("./PYTHON/executePYcode.js");
const {submitPythonCode} = require("./PYTHON/submitPYcode.js");
const dotenv = require("dotenv");
const cors = require("cors");
const { executeCCode } = require("./C/executeCcode.js");
const { submitCCode } = require("./C/submitCcode.js");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Compiler is running");
});

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;
  if (code === undefined) {
    return res
      .status(404)
      .json({ success: false, message: "Please Enter your code" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    if (language === "cpp") {
      const output = await executeCPPCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    if(language === "c") {
      const output = await executeCCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    
    if (language === "py") {
      const output = await executePythonCode(filePath, inputPath);
      return res.status(200).json({ success: true, output });
    }
    return res
      .status(400)
      .json({ success: false, message: "please enter the correct language" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/submit", async (req, res) => {
  const { language = "cpp", code, testcases } = req.body;
  if (!code) {
    return res.status(404).json({ success: false, message: "Please Enter your code" });
  }
  try {
    const filePath = await generateFile(language, code);
    if (language === "cpp") {
      const result = await submitCppCode(filePath, testcases);
      return res.status(200).json({ success: true, output: result });
    }
    if (language === "c") {
      const result = await submitCCode(filePath, testcases);
      return res.status(200).json({ success: true, output: result });
    }

    if(language === "py") {
      const result = await submitPythonCode(filePath, testcases);
      return res.status(200).json({ success: true, output: result });
    }

    return res.status(400).json({ success: false, message: "please enter the correct language" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});