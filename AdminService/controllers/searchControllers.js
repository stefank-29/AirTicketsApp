const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');
// const { datesAreOnSameDay } = require('../helpers');

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

exports.searchDepartureFlight = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 3;
    const skip = page * limit - limit;

    let departureFlights = [];
    // let returnFlights = [];
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

    // //*** return ***//
    // const flightsR = await Flight.find({
    //     from: req.query.destination,
    //     to: req.query.origin,
    // })
    //     .populate({ path: 'airplane' })
    //     .sort({ departure: 1 })
    //     .skip(skip)
    //     .limit(limit);

    flightsD.forEach((f) => {
        if (
            f.airplane.capacity >= f.passengersNumber + req.query.passengers &&
            datesAreOnSameDay(new Date(f.departure), new Date(req.query.departure))
        ) {
            departureFlights.push(f);
        }
    });

    // flightsR.forEach((f) => {
    //     if (
    //         f.airplane.capacity >= f.passengersNumber + req.query.passengers &&
    //         datesAreOnSameDay(new Date(f.departure), new Date(req.query.return))
    //     ) {
    //         returnFlights.push(f);
    //     }
    // });

    res.send({ departureFlights, page, pages, count });
};

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
