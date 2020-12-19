const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // nice error messages
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');

const flightSscheme = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    airplane: {
        type: mongoose.Schema.ObjectId,
        ref: 'Airplane',
        required: true,
    },
});

module.exports = mongoose.model('Flight', flightSscheme);
