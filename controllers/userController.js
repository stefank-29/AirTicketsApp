const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const { prototype } = require('extract-text-webpack-plugin');
const jwt = require('jsonwebtoken'); 
const jwtController = require('./jwtController');
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
    req.checkBody(
        'password-confirm',
        'Confirmed Password cannot be blank'
    ).notEmpty();
    req.checkBody('password-confirm', 'Your password do not match').equals(
        req.body.password
    );

    req.checkBody(
        'passportNumber',
        'You must supply a passport number'
    ).notEmpty();
    req.checkBody(
        'passportNumber',
        'Passport number must be numeric'
    ).isNumeric();

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
    
    user.save()
        .then((user)=>{
            const jwt = jwtController.issueJWT(user);
            res.cookie('jwt',jwt.token);
            next();           
            
        })
        .catch(err => next(err))
 
    
 };

exports.account = (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passportNumber: req.body.passportNumber,
    };
    const user = await User.findOneAndUpdate(
        { _id: res.locals.user._id },
        { $set: updates },
        {
            new: true,
            runValidators: true,
            context: 'query',
            useFindAndModify: false,
        }
    );
    req.flash('success', 'The profile is updated!');
    res.redirect('back');
};