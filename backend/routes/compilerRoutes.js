const express = require('express');
const { runCode } = require("../controllers/compilerController");
const router = require("express").Router();

router.post('/', runCode);

module.exports = router;