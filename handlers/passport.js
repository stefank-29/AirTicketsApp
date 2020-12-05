const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// proverava kod logina da li postoji user
passport.use(User.createStrategy());

// pita passport sta da radi sa userom kad se uloguje
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
