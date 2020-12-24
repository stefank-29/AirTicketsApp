const mongoose = require('mongoose');
const Ticket = mongoose.model('Tickets');
const axios = require('axios');
const { response } = require('express');

exports.storeQuery = (req, res) => {
    req.session.flightId = req.query.flightId;
    req.session.userId = req.query.userId;

    res.redirect('/tickets/buy');
};

exports.buyTicket = (req, res, next) => {
    const params = new URLSearchParams({
        flightId: req.session.flightId,
        userId: req.session.userId,
    }).toString();
    const url = 'http://127.0.0.1:8000/getInfo?' + params;
    axios
        .get(url)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
    const urlService2 = 'http://127.0.0.1:7777/getInfo?' + params;
    axios
        .get(urlService2)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
    next();
};
