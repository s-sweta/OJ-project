const express = require('express');
const router = express.Router();
const { getAllProblems, createProblem, updateProblem, deleteProblem } = require('../controllers/problemController');

// Endpoint for getting all problems
router.get('/', getAllProblems);

// Endpoint for creating a new problem
router.post('/', createProblem);

// Endpoint for updating an existing problem
router.put('/:id', updateProblem);

// Endpoint for deleting an existing problem
router.delete('/:id', deleteProblem);

module.exports = router;
