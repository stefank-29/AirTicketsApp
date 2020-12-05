const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // nice error messages
const passportLocalMongoose = require('passport-local-mongoose');

const userScheme = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please supply a name.',
    },
    surname: {
        type: String,
        trim: true,
        required: 'Please supply a surname.',
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: true,
    },
    passportNumber: {
        type: Number,
        required: true,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userScheme.plugin(passportLocalMongoose, { usernameField: 'email' }); // email koristim za username
userScheme.plugin(mongodbErrorHandler); // nice error messages

module.exports = mongoose.model('User', userScheme);
