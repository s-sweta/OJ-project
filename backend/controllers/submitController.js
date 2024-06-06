const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { generateFile, generateInputFile, executeCode, runCode} = require('./compilerController');


const submitCode = async (req, res) => {
    const { language = 'cpp', code } = req.body;
    const { problemId } = req.params;
    const submissionDateTime = new Date(); // Current date and time

    try {
        // Fetch problem with test cases
        const problem = await Problem.findById(problemId).populate('testCases');
        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found." });
        }
        
        const testCases = problem.testCases;

        // Execute code for each test case
        const results = [];
        for(const testCase of testCases) {
            const { input: testCaseInput, expectedOutput } = testCase;
            const output = await runCode(language, code, testCaseInput);

            const testCaseResult = {
                input: testCaseInput,
                expectedOutput,
                output,
                verdict: (output === expectedOutput) ? 'Accepted' : 'Wrong Answer'
            };
            results.push(testCaseResult);
        }

        // Calculate overall verdict
        const overallVerdict = results.every(result => result.verdict === 'Accepted') ? 'Accepted' : 'Wrong Answer';

        // Save submission to database
        const submission = new Submission({
            
            problemId,
            code,
            verdict: overallVerdict,
            language,
            submissionDateTime,
            results
        });
        await submission.save();

        res.json({ success: true, message: "Code submitted successfully.", results });
    } catch (error) {
        console.error("Error submitting code:", error);
        res.status(500).json({ success: false, message: error});
    }
};


// Function to get all submissions for a specific user
const getAllMySubmissions = async (req, res) => {
    const { userId } = req.params;

    try {
        const submissions = await Submission.find({ userId }).populate('problemId');
        res.json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Function to get all submissions for a specific problem
const getAllSubmissionsForProblem = async (req, res) => {
    
    const {userId, problemId } = req.params;
    const existingSubmission = await Submission.findOne({userId, problemId});
        if(!existingSubmission) {
            return res.status(400).json({success: false, error: "Please attempt the problem to view all submissions."})
        }

    try {
        const submissions = await Submission.find({ problemId }).populate('userId');
        res.json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { submitCode, getAllMySubmissions, getAllSubmissionsForProblem };
