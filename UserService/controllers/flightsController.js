const mongoose = require('mongoose');
const User = mongoose.model('User');
const Card = mongoose.model('Card');
const axios = require('axios');

exports.storeQuery = (req, res) => {
    req.session.origin = req.body.origin;
    req.session.destination = req.body.destination;
    req.session.departure = req.body.departure;
    req.session.return = req.body.return;

    req.session.passengers = req.body.passengers;

    res.redirect('/flights/page/1');
};

exports.getFlights = (req, res) => {
    const page = req.params.page;

    const params = new URLSearchParams({
        origin: req.session.origin,
        destination: req.session.destination,
        departure: req.session.departure,
        return: req.session.return,
        passengers: req.session.passengers,
        page: page,
    }).toString();
    const url = 'http://127.0.0.1:7777/search?' + params;
    axios
        .get(url)
        .then((response) => {
            flightsDeparture = response.data.departureFlights;
            returnFlights = response.data.returnFlights;
            // console.log(flights);
            // res.json(response.data);
            return res.render('flightsList', { flightsDeparture, returnFlights });
        })
        .catch((err) => {
            console.log(err);
        });
    //next();
};

exports.flightsPage = (req, res) => {
    flightsDeparture = req.flightsDeparture;
    returnFlights = req.returnFlights;
    console.log(req);
    return res.render('flightsList', { flightsDeparture, returnFlights });
};
