const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const { catchErrors } = require('../handlers/errorHandlers');
const passport = require('passport');
const jwtAuth = require('../handlers/passport');

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/tickets', jwtAuth.authenticateToken, ticketController.ticketsPage);

// auth
router.get('/register', userController.registerForm);
router.post(
    '/register',
    userController.validateRegister,
    catchErrors(userController.register),
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Failed login.',
    }),
    authController.login
);

router.get('/login', userController.loginForm);
router.post(
    '/login',
    passport.authenticate('local', {
        session: false,
        failureRedirect: '/login',
        failureFlash: 'Failed login.',
    }),
    authController.login
);

router.get('/logout', authController.logout);

// account
router.get('/account', jwtAuth.authenticateToken, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.resetForm));
router.post(
    '/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.updatePassword)
);
router.get(
    '/account/verify/:token',
    userController.verifyEmail,
    authController.login
);

router.get('/resetPassword', authController.resetPasswordForm);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
