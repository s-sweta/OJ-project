const express = require('express');
const router = express.Router();
const {
    registerValidator,
    authProvider
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
} = require('../controllers/authController');


router.post('/login', loginController);
router.post('/register', registerValidator, registerController);
router.get('/logout', logoutController);
router.get('/loggedIn', loggedInController);
router.put('/changePassword', changePasswordController);

module.exports = router;