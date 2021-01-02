const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');
const cron = require('cron').CronJob;
// const cron = require('node-cron');
// const { datesAreOnSameDay } = require('../helpers');
var schedule = require('node-schedule');
const axios = require('axios');
const { response } = require('express');

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

exports.searchDepartureFlight = async (req, res) => {
    req.session.count = req.query.passengers;
    
    const page = req.query.page || 1;
    const limit = 3;
    const skip = page * limit - limit;

    let departureFlights = [];
    //*** departure ***//
    const flightsPromise = Flight.find({
        from: req.query.origin,
        to: req.query.destination,
    })
        .populate({ path: 'airplane' })
        .sort({ departure: 1 })
        .skip(skip)
        .limit(limit);

    const query = { from: req.query.origin, to: req.query.destination };
    const countPromise = Flight.countDocuments(query);

    const [flightsD, count] = await Promise.all([flightsPromise, countPromise]);
    const pages = Math.ceil(count / limit);

    flightsD.forEach((f) => {
        if (
            f.airplane.capacity >= f.passengersNumber + parseInt(req.query.passengers) &&
            datesAreOnSameDay(new Date(f.departure), new Date(req.query.departure))
        ) {
            console.log(f.airplane.capacity);
            console.log(f);
            console.log(req.query.passengers)
            departureFlights.push(f);
        }
    });

    res.send({ departureFlights, page, pages, count });
};
var task;
exports.getInfo = async (req, res) => {
          
    if(req.query.flightId != 'undefined' && req.query.passengers != 'undefined'){
       
        const flight = await Flight.findOne({ _id: req.query.flightId });
        await flight.updateOne({ $set: { passengersNumber: flight['passengersNumber'] + parseInt(req.query.passengers) } }); 
        flight.passengersNumber += parseInt(req.query.passengers);
             
        res.send(flight);
    }else
        res.send(null);

};

exports.updatePassengers = async (req,res) => {
    const flight = await Flight.findOne({ _id: req.query.flightId });
    console.log(flight);
    await flight.updateOne({ $set: { passengersNumber: flight['passengersNumber'] - parseInt(req.query.passengers) } }); 
    res.send('http://127.0.0.1:8000/')
    
    
}

exports.searchReturnFlight = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 3;
    const skip = page * limit - limit;

    let returnFlights = [];

    // //*** return ***//
    const flightsPromise = await Flight.find({
        from: req.query.destination,
        to: req.query.origin,
    })
        .populate({ path: 'airplane' })
        .sort({ departure: 1 })
        .skip(skip)
        .limit(limit);

    const query = { from: req.query.destination, to: req.query.origin };
    const countPromise = Flight.countDocuments(query);

    const [flightsR, count] = await Promise.all([flightsPromise, countPromise]);
    const pages = Math.ceil(count / limit);

    flightsR.forEach((f) => {
        if (
            f.airplane.capacity >= f.passengersNumber + req.query.passengers &&
            datesAreOnSameDay(new Date(f.departure), new Date(req.query.return))
        ) {
            returnFlights.push(f);
        }
    });

    res.send({ returnFlights, page, pages, count });
};
