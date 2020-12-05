const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/app', (req, res) => {
    res.render('blog', { title: 'dsad' });
});

router.get('/register', userController.registerForm);

router.post(
    '/register',
    userController.validateRegister,
    catchErrors(userController.register),
    authController.login
);

router.get('/login', userController.loginForm);

module.exports = router;
