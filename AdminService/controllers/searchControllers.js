const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');
// const { datesAreOnSameDay } = require('../helpers');

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

exports.searchFlight = async (req, res) => {
    let arrayOfFlights = [];
    const flight = await Flight.find({
        from: req.query.origin,
        to: req.query.destination,
        departure: { $gt: req.query.departure },
    })
        .populate({ path: 'airplane' })
        .sort({ departure: 1 });
    // exec(async (err,flight) =>{

    //      flight.forEach(f => {

    //         if(f.airplane.capacity >= (f.passengersNumber+ req.query.passengers)){
    //             console.log(f);
    //          arrayOfFlights.push(f);
    //         }
    //     });
    // });

    flight.forEach((f) => {
        console.log(new Date(f.departure), new Date(req.query.departure));
        if (
            f.airplane.capacity >= f.passengersNumber + req.query.passengers &&
            datesAreOnSameDay(new Date(f.departure), new Date(req.query.departure))
        ) {
            arrayOfFlights.push(f);
        }
    });
    console.log(arrayOfFlights);
    res.send(arrayOfFlights);
};
