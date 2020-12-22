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
            const flightsDeparture = response.data.departureFlights;
            const returnFlights = response.data.returnFlights;
            const page = response.data.page;
            const pages = response.data.pages;
            const count = response.data.countD;
            // console.log(flights);
            // res.json(response.data);
            console.log(flightsDeparture.length);
            if (flightsDeparture.length == 0) {
                req.flash(
                    'info',
                    `You asked for page ${page}, but that doesn't exists. So I put you on page ${pages}`
                );
                return res.redirect(`/flights/page/${pages - 1}`);
            }
            return res.render('flightsList', {
                flightsDeparture,
                returnFlights,
                page,
                pages,
                count,
            });
        })
        .catch((err) => {
            console.log(err);
        });
    //next();
};

exports.flightsPage = (req, res) => {
    flightsDeparture = req.flightsDeparture;
    returnFlights = req.returnFlights;

    return res.render('flightsList', { flightsDeparture, returnFlights });
};
