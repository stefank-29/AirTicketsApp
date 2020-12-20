const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');


exports.searchFlight = async (req,res) => {
   let arrayOfFlights = [];
   const flight = await Flight.find({from: req.query.origin, to: req.query.destination,
        departure: {$gt: req.query.departure}}).populate({path: 'airplane'});
        
   flight.forEach(f => {
        
        if(f.airplane.capacity >= (f.passengersNumber+ req.query.passengers)) {
            arrayOfFlights.push(f);
            }  

   });         
   console.log(arrayOfFlights);
   res.send(arrayOfFlights);                 
} 