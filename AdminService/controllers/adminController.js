const mongoose = require('mongoose');
const Airplane = mongoose.model('Airplane');
const Flight = mongoose.model('Flight');

exports.airplane = async (req,res,next) => {
    
    const airplane = new Airplane({
        name: req.body.name,
        capacity: req.body.capacity 
    });
    await airplane.save();
    next();
    
} 

exports.flight = async (req,res,next) => {
    
    const flight = new Flight({
        from: req.body.from,
        to: req.body.to, 
        km: req.body.km,
        price: req.body.price 

    });
    await flight.save();
    next();

} 