const mongoose = require('mongoose');
const Ticket = mongoose.model('Tickets');
const axios = require('axios');
const { response } = require('express');

exports.storeQuery = (req, res) => {
    req.session.flightId = req.query.flightId;
    req.session.userId = req.query.userId;
    req.session.passengers = req.query.passengers;

    console.log(req.query.flightId, req.query.userId, req.query.passengers);

    res.redirect('/tickets/buy');
};

exports.infoTicket = async (req, res, next) => {
    let user, flight;

    const passengers = req.session.passengers;
    req.passengers = passengers;
    const params = new URLSearchParams({
        flightId: req.session.flightId,
        userId: req.session.userId,
        passengers: passengers,
    }).toString();
    const url = 'http://127.0.0.1:8000/getInfo?' + params;

    const respUser = await axios.get(url);

    req.user = respUser.data;

    const urlService2 = 'http://127.0.0.1:7777/getInfo?' + params;

    const respFlight = await axios.get(urlService2);

    req.flight = respFlight.data;

    next();
};

exports.scheduleTrigger = (req, res, next) => {
    var rule = new schedule.RecurrenceRule();
    rule.minute = 1;
    let startTime = new Date(Date.now() + 5000);
    let endTime = new Date(startTime.getTime() + 720000);

    schedule.scheduleJob(
        req.query.userId,
        { start: startTime, end: endTime, rule: '* * * * * ' },
        async function () {
            console.log('uso');
            await flight.updateOne({
                $set: {
                    passengersNumber: flight['passengersNumber'] - parseInt(req.query.passengers),
                },
            });
        }
    );
};

exports.homeRedirect = async (req, res) => {
    console.log('sad');

    const response = await axios.get('http://127.0.0.1:8000');
    console.log(response.request._redirectable._currentUrl);
    return res.redirect(response.request._redirectable._currentUrl);
};

exports.buyTicket = async (req, res) => {
    const ticket = new Ticket({
        userId: req.session.userId,
        flightId: req.session.flightId,

        purchase: new Date(),
    });

    const params = new URLSearchParams({
        stop: true,
        userId: req.session.userId,
    });
    const urlService2 = 'http://127.0.0.1:7777/getInfo?' + params;

    await ticket.save();
    const respFlight = await axios.get(urlService2);
    console.log(respFlight.data);
    res.redirect(respFlight.data);
};

exports.buyForm = (req, res) => {
    user = req.user;
    flight = req.flight;
    passengers = req.passengers;

    // console.log(user);
    res.render('ticketForm', { title: 'Buy tickets', user, flight, passengers });
};

exports.addCard = (req, res) => {
    const userId = req.params.id;
    const params = new URLSearchParams({
        id: userId,
    }).toString();

    const url = 'http://127.0.0.1:8000/account/card/buy?' + params;
    axios
        .get(url)
        .then((response) => {
            res.redirect(response.config.url);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.logout = (req, res) => {
    const url = 'http://127.0.0.1:8000/logout';
    axios.get(url).then((response) => {
        return res.redirect(response.config.url);
    });
};
