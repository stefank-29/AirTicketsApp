const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '../handlers', 'id_rsa_priv.pem');
const pathPub = path.join(__dirname, '../handlers', 'id_rsa_pub.pem');


const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
const PUB_KEY = fs.readFileSync(pathPub, 'utf8');



exports.issueJWT = (user) => {
    const _id = user.id;
  
    const expiresIn = '1d';
  
    const payload = {
      sub: _id,
      iat: Date.now()
    };
  
    const signedToken = jsonwebtoken.sign(payload,PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    jsonwebtoken.verify(signedToken, PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
      if(err){
      if (err.name === 'TokenExpiredError') {
          console.log('Whoops, your token has expired!');
      }
      
      if (err.name === 'JsonWebTokenError') {
          console.log('That JWT is malformed!');
      }
      
      if (err === null) {
          console.log('Your JWT was successfully validated!');
      }}});
      
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
  }
exports.genPassword =(password) => {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return {
    salt: salt,
    hash: genHash
  };
}  

exports.validPassword = (password, hash, salt) =>{
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}
