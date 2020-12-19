const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');


exports.searchFlight = (req,res) => {
    
    const flights = Flight.find({ from : req.body.from , to : req.body.to ,
         departure : { $gt: req.body.departure }}); 
} 