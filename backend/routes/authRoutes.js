const express = require('express');
const router = express.Router();
const {
    registerValidator,
    authValidator,
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
} = require('../controllers/authController');


router.post('/login', loginController);
router.post('/register',  registerController);
router.get('/logout', logoutController);
router.get('/loggedIn', loggedInController);
router.post('/', authValidator);
router.put('/changePassword', changePasswordController);

module.exports = router;