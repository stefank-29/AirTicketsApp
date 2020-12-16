const passport = require('passport');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const pathToken = path.join(__dirname, '.' , 'id_rsa_pub.pem'); 
const PUB_key = fs.readFileSync(pathToken,'utf-8');

const cookieExtractor= function(req){
    let token = null;
    if(req && req.cookies){
        token = req.cookies['jwt'];
        
    }
    return token;
} 

// const options = {
//     jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
//     secretOrKey: PUB_key,
//     algorithms: ['RS256']  
// };
const passportJWTOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: PUB_key,
    issuer: 'enter issuer here',
    audience: 'enter audience here',
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: false,
    jsonWebTokenOptions: {
        complete: false,
        clockTolerance: '',
        maxAge: '2d', // 2 days
        clockTimestamp: '100',
        nonce: 'string here for OpenID'
    }
}



passport.use(new JwtStrategy(passportJWTOptions, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.sub}, 
        function(err, user) {
        if (err) {
            // return done(err, false);
        }
        if (user) {
           
            // return done(null, user);
        } else {
            // return done(null, false);
           
        }
    });
}));
// const strategy = new JwtStrategy({
//     secretOrPublicKey: 'StRoNGs3crE7'
// }, (payload, done) => {
//     return done(null, payload.user);
// });

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// module.exports = (passport) =>{
//     passport.use(strategy);
// }

//proverava kod logina da li postoji user


// pita passport sta da radi sa userom kad se uloguje

