const Problem = require('../models/Problem');

// Controller function to handle getting all problems
const getAllProblems = async (req, res) => {
    try {
        // to find all problems in the database
        const problems = await Problem.find();
        
        // Send the list of problems as a JSON response
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, input, output, testcases } = req.body;
        const newProblem = new Problem({ title, description, difficulty, input, output, testcases });
        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to handle updating an existing problem
const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to handle deleting an existing problem
const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        await Problem.findByIdAndDelete(id);
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProblems,
    createProblem,
    updateProblem,
    deleteProblem
};
