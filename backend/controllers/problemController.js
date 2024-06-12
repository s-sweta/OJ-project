const Problem = require('../models/Problem');
const { findById } = require('../models/User');

// Controller function to handle getting all problems
const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to handle creating a new problem
const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            sampleInput,
            sampleOutput,
            constraints,
            inputFormat,
            outputFormat,
            testCases
        } = req.body;

        const newProblem = await Problem.create({
            title,
            description,
            difficulty,
            sampleInput,
            sampleOutput,
            constraints,
            inputFormat,
            outputFormat,
            testCases
        });

        res.status(201).json(newProblem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Controller function to handle updating an existing problem
const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProblemData = req.body;
        const updatedProblem = await Problem.findByIdAndUpdate(id, updatedProblemData, { new: true });

        if (updatedProblemData.testCases) {
            await Promise.all(updatedProblemData.testCases.map(async (testCaseData, index) => {
                let testCase = updatedProblem.testCases[index];
                testCase.input = testCaseData.input;
                testCase.expectedOutput = testCaseData.expectedOutput;
                await testCase.save();
            }));
        }

        res.json(updatedProblem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller function to handle deleting an existing problem
const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        await Problem.findByIdAndDelete(id);
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);
        if(problem) {
            res.json(problem)
        } else {
            res.satus(404).json({error: "Problem not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    getProblem
};

