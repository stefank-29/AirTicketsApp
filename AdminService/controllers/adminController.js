const mongoose = require('mongoose');
const Airplane = mongoose.model('Airplane');
const Flight = mongoose.model('Flight');

exports.addAirplane = async (req, res, next) => {
    const airplane = new Airplane({
        name: req.body.name,
        capacity: req.body.capacity,
    });
    await airplane.save();
    res.redirect('back');
};

exports.addFlight = async (req, res, next) => {
    
    const airplane = await Airplane.findOne({_id : req.body.airplane})
    
    const flight = new Flight({
        from: req.body.from,
        to: req.body.to,
        departure: new Date(req.body.departure),
        arrival : new Date(req.body.arrival),
        price: req.body.price,
        
        airplane: airplane 
    });
   
    await flight.save();
    res.redirect('back');
    // next();
};

exports.deleteAirplane = async (req, res, next) => {
    const airplane = await Airplane.deleteOne({ _id: req.params });
};

exports.adminDashboard = (req, res) => {
    res.render('dashboard');
};

exports.addAirplaneForm = (req, res, next) => {
    res.render('airplaneForm');
};

exports.addFlightForm = async (req, res, next) => {
    const airplanes = await Airplane.find();
    res.render('flightForm', { airplanes });
};

exports.getFlights = async (req, res, next) => {
    const flights = await Flight.find().populate('airplane'); // da vrati i atribute aviona
    res.render('dashboard', { title: 'Admin Dashboard', flights });
};

exports.getAirplanes = async (req, res, next) => {
    const airplanes = await Airplane.find();
    res.render('dashboard', { title: 'Admin Dashboard', airplanes });
};

exports.deleteFlight = async (req, res, next) => {
    await Flight.findOneAndDelete({ _id: req.params.id });
    res.render('dashboard', { title: 'Admin Dashboard', airplanes });
};
