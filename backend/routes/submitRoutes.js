const express = require('express');
const router = express.Router();
const {submitSolution, getAllMySubmissions, getSolvedProblems } = require('../controllers/submitController');

router.post('/:problemId/:userId', submitSolution);

router.post('/:userId', getAllMySubmissions);

router.get('/problem/:userId', getSolvedProblems);

module.exports = router;
