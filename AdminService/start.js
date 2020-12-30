const mongoose = require('mongoose');

// import enviromnet varibles from variables.env
require('dotenv').config({ path: 'variables.env' }); // to access config via proces.env

// Connect to database
const conn = mongoose.createConnection(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
});
mongoose.set('useCreateIndex', true);

// import models
require('./models/Flight');
require('./models/Airplane');

// run server
const app = require('./app');
app.set('port', process.env.PORT || 5555);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running => PORT ${server.address().port}`);
});

exports.conn = conn;
//require('./handlers/mail');
