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
    
    await airplane.update({$set: {active:req.body.arrival}});


    const flight = new Flight({
        from: req.body.from,
        to: req.body.to,
        departure: new Date(req.body.departure),
        arrival: new Date(req.body.arrival),
        price: req.body.price,

        airplane: airplane,
    });

    await flight.save();
    res.redirect('back');
    // next();
};

exports.deleteAirplane = async (req, res, next) => {
    const airplane = await Airplane.findOne({ _id: req.params.id });
    
    if(airplane.active <= Date.now() || airplane.active == undefined) {
        await airplane.delete();
        res.redirect('/admin/dashboard/airplanes');
    }
    else{
        req.flash('error','airplane is active');
        res.redirect('/account');
    }
    
};

exports.adminDashboard = (req, res) => {
    res.render('dashboard');
};

exports.addAirplaneForm = (req, res, next) => {
    res.render('airplaneForm');
};

exports.addFlightForm = async (req, res, next) => {
    const airplanes = await Airplane.find({$or: [{active: {$lt:Date.now()}}, {active:null}]} );
    
    res.render('flightForm', { airplanes });
};

exports.getFlights = async (req, res, next) => {
    const flights = await Flight.find().populate('airplane').sort({ departure: 1 }); // da vrati i atribute aviona
    res.render('dashboard', { title: 'Admin Dashboard', flights });
};

exports.getAirplanes = async (req, res, next) => {
    const airplanes = await Airplane.find().sort({ name: 1 });
    res.render('dashboard', { title: 'Admin Dashboard', airplanes });
};

exports.deleteFlight = async (req, res, next) => {
    const flight = await Flight.findOne({ _id: req.params.id }).populate('airplane');
    const airplane = await Airplane.findOne({ _id: flight.airplane.id});
   
    
    await airplane.update({$set: {active: Date.now()}});
    await flight.delete();
   
    res.redirect('/admin/dashboard/flights');
};
