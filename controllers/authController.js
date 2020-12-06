const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');
//const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed login',
    successFlash: 'Successfully logged in',
    successRedirect: '/',
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

exports.forgot = async (req, res) => {
    //1. See if user with that email exists
    const user = await User.findOne({ email: req.body.email });
    //res.json(user);
    if (!user) {
        req.flash('error', 'No account with that email exists.');
        //req.flash('success', 'A password reset has been mailed to you.'); //? security poruka iako ne postoji user
        return res.redirect('/login');
    }
    //2. Set reset token and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 1800000; // 30min
    await user.save();
    //3. Send email with the token
    //? req.headers.host => vraca domen odnosno localhost
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash(
        'success',
        `You have been emailed a password reset link. ${resetURL}`
    );
    //4. redirect to login page
    res.rediret('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }, // token is still active
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
};
