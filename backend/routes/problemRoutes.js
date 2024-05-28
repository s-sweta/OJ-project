const express = require('express');
const router = express.Router();
const { getAllProblems, createProblem, updateProblem, deleteProblem } = require('../controllers/problemController');

// Endpoint for getting all problems
router.get('/', getAllProblems); // Use '/' as the base route

// Endpoint for creating a new problem
router.post('/', createProblem); // Use '/' as the base route

// Endpoint for updating an existing problem
router.put('/:id', updateProblem); // Use '/:id' for identifying the problem to update

// Endpoint for deleting an existing problem
router.delete('/:id', deleteProblem); // Use '/:id' for identifying the problem to delete

module.exports = router;
