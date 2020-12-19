const mongoose = require('mongoose');
const Airplane = mongoose.model('Airplane');
const Flight = mongoose.model('Flight');

exports.addAirplane = async (req, res, next) => {
    const airplane = new Airplane({
        name: req.body.name,
        capacity: req.body.capacity,
    });
    await airplane.save();
    next();
};

exports.addFlight = async (req, res, next) => {
    const flight = new Flight({
        from: req.body.from,
        to: req.body.to,
        km: req.body.km,
        price: req.body.price,
    });
    await flight.save();
    next();
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
    const flights = await Flight.find();
    res.json(flights);
    //res.render('dashboard', { title: 'Admin Dashboard', flights });
};

exports.getAirplanes = async (req, res, next) => {
    const airplanes = await Airplane.find();
    res.render('dashboard', { title: 'Admin Dashboard', airplanes });
};
