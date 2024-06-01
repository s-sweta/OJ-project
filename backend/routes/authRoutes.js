const express = require('express');
const router = express.Router();
const { test, registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authController');

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/logout', logoutUser);

module.exports = router;