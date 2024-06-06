const express = require('express');
const router = express.Router();
const submitController = require('../controllers/submitController');


router.post('/:problemId', submitController.submitCode);

router.get('/user/:userId', submitController.getAllMySubmissions);

router.get('/problem/:userId/:problemId', submitController.getAllSubmissionsForProblem);

module.exports = router;
