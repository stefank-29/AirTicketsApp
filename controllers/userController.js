const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
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
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passportNumber: req.body.passportNumber,
    });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next(); // login
};
