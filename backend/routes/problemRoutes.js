const express = require('express');
const router = express.Router();
const { getAllProblems, createProblem, updateProblem, deleteProblem, getProblem } = require('../controllers/problemController');


router.get('/', getAllProblems);
router.post('/', createProblem);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);
router.get('/:id', getProblem);

module.exports = router;
