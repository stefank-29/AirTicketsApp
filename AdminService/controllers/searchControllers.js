const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');


exports.searchFlight = async (req,res) => {
   
   const flight = await Flight.find({from: req.query.origin, to: req.query.destination,
        departure: {$gt: req.query.departure}});
   
   res.send(flight);                 
} 