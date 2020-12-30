const mongoose = require('mongoose');
const Airplane = mongoose.model('Airplane');
const Flight = mongoose.model('Flight');
const axios = require('axios');
const { response } = require('express');
const Queue = require('bee-queue');
// const Agenda = require('agenda');
// const agenda = new Agenda({db: {address: process.env.AGENDA_DATABASE, collection: 'agenda'}});


exports.addAirplane = async (req, res, next) => {
    const airplane = new Airplane({
        name: req.body.name,
        capacity: req.body.capacity,
    });
    await airplane.save();
    res.redirect('back');
};

exports.addFlight = async (req, res, next) => {
    const airplane = await Airplane.findOne({ _id: req.body.airplane });

    await airplane.update({ $set: { active: req.body.arrival } });

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

    if (airplane.active <= Date.now() || airplane.active == undefined) {
        await airplane.delete();
        res.redirect('/admin/dashboard/airplanes');
    } else {
        req.flash('error', 'airplane is active');
        res.redirect('/account');
    }
};

exports.adminGetEmail = (req, res) => {
    // console.log('email iz querija ' + req.query.email + 'jwt: ' + req.query.jwt);
    //console.log(req.query.jwt);
    // console.log('-----------------------------');
    // console.log(req.cookies['jwt']);
    req.session.email = req.query.email;

    res.redirect('/admin/dashboard/');
};

exports.adminDashboard = (req, res) => {
    console.log(req.session.email);
    res.render('dashboard');
};

exports.addAirplaneForm = (req, res, next) => {
    res.render('airplaneForm');
};

exports.addFlightForm = async (req, res, next) => {
    const airplanes = await Airplane.find({
        $or: [{ active: { $lt: Date.now() } }, { active: null }],
    });

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
    const airplane = await Airplane.findOne({ _id: flight.airplane.id });

    await airplane.update({ $set: { active: Date.now() } });
    await flight.delete();

    res.redirect('/admin/dashboard/flights');
};

exports.logout = (req, res) => {
    const url = 'http://127.0.0.1:8080/logout';
    axios.get(url).then((response) => {
        return res.redirect(response.config.url);
    });
};

exports.account = (req, res) => {
    // const jwt = req.cookies['jwt'];
    // const params = new URLSearchParams({
    //     jwt: jwt,
    // }).toString();
    const url = 'http://127.0.0.1:8080/accountadmin';
    axios
        .get(url)
        .then((response) => {
            res.redirect(response.config.url);
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.cancelFlight = (req,res) => {
   
    agenda.define('cancel flight', async job => {
        const url = 'http://127.0.0.1:8888/k'
        console.log('my agenda');
        const response = await axios.get(url); 
      });
       
      (async function() { 
        await agenda.start();
       
        
      })();

}



