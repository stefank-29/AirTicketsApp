const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const { prototype } = require('extract-text-webpack-plugin');
const jwt = require('jsonwebtoken');
const jwtController = require('./jwtController');
const mail = require('../handlers/mail');
const auth = require('./authController');
exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Log In' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply name').notEmpty();
    req.checkBody('surname', 'You must supply surname').notEmpty();
    req.checkBody('email', 'You must sypply correct email address').isEmail();
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Your password do not match').equals(req.body.password);

    req.checkBody('passportNumber', 'You must supply a passport number').notEmpty();
    req.checkBody('passportNumber', 'Passport number must be numeric').isNumeric();

    const errors = req.validationErrors();
    if (errors) {
        req.flash(
            'error',
            errors.map((err) => err.msg)
        );
        res.render('register', {
            title: 'Register',
            body: req.body,
            flashes: req.flash(),
        });
        return; // stop function from runnin`g
    }
    next(); // there were no errors
};

exports.register = async (req, res, next) => {
    const password = jwtController.genPassword(req.body.password);

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passportNumber: req.body.passportNumber,
        hash: password.hash,
        salt: password.salt,
    });
    user.emailToken = crypto.randomBytes(20).toString('hex');

    const resetURL = `http://${req.headers.host}/account/verify/${user.emailToken}`;
    await mail.send({
        user,
        subject: 'Verify Account',
        resetURL,
        filename: 'verify-account', // renderovanje html-a
    });
    // req.flash('success', `You have been emailed a password reset link.`);

    user.save()
        .then((user) => {
            // const jwt = jwtController.issueJWT(user);
            // res.cookie('jwt',jwt.token);
            next();
        })
        .catch((err) => next(err));
};

exports.verifyEmail = async (req, res, next) => {
    const user = await User.findOne({ emailToken: req.params.token });
    if (user) {
        user.isValid = true;
        await user.save();
        next();
    } else {
        req.flash('error', 'Invalid token!');
    }
};

exports.account = (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
    if(req.body.update !== undefined){
    const updates = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passportNumber: req.body.passportNumber,
    };
    const user = await User.findOne({_id:res.locals.user._id});
    console.log(user);
    if(user.email === req.body.email){
       await User.findOneAndUpdate({_id:res.locals.user._id},
        { $set: updates },
        {
            new: true,
            runValidators: true,
            context: 'query',
            useFindAndModify: false,
       })
    }else {
       
        updates.isValid = false;
        await User.findOneAndUpdate({_id:res.locals.user._id},
            { $set: updates },
            {
                new: true,
                runValidators: true,
                context: 'query',
                useFindAndModify: false,
           })

        
        
        req.flash('info', 'Please verify your new email');
        user.emailToken = crypto.randomBytes(20).toString('hex');
        await user.save();   
        const resetURL = `http://${req.headers.host}/account/verify/${user.emailToken}`;
        await mail.send({
        user,
        subject: 'Verify Account',
        resetURL,
        filename: 'verify-account', // renderovanje html-a

    });

    res.cookie('jwt', 'deleted');
    res.redirect('/login');
    }
   

    // );
    req.flash('success', 'The profile is updated!');
    res.redirect('back');
    }else{
        res.redirect('/resetPassword');
    }
};