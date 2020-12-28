const mongoose = require('mongoose');
const Ticket = mongoose.model('Tickets');
const axios = require('axios');
const { response } = require('express');
const schedule = require('node-schedule');

exports.storeQuery = (req, res) => {
    req.session.flightId = req.query.flightId;
    req.session.userId = req.query.userId;
    req.session.passengers = req.query.passengers;

    console.log(req.query.flightId, req.query.userId, req.query.passengers);

    res.redirect('/tickets/buy');
};

function minutesTomiles(millisecond) {
    let min = Math.floor(millisecond/60000);
    
    return min * 10;
}


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

    req.session.miles = minutesTomiles(respFlight.data.duration);

    next();
};

exports.scheduleTrigger = (req, res, next) => {
    var rule = new schedule.RecurrenceRule();
    rule.minute = 1;
    let startTime = new Date(Date.now() + 5000);
    let endTime = new Date(startTime.getTime() + 720000);

    schedule.scheduleJob(
        req.session.userId,
        { start: startTime, end: endTime, rule: '* * * * * ' },
        async function () {
            console.log('uso');
            const params = new URLSearchParams({
                flightId: req.session.flightId,
                userId: req.session.userId,
                passengers: req.session.passengers,
            }).toString();
            const url = 'http://127.0.0.1:7777/update/passengers?' + params;
            const response = await axios.get(url);
            console.log(response);
        }
    );

    next();
};

exports.homeRedirect = async (req, res) => {
    console.log('sad');

    schedule.scheduleJob(
        req.session.userId,
        { start: startTime, end: endTime, rule: '* * * * * ' },
        async function () {
            console.log('uso');
            const params = new URLSearchParams({
                flightId: req.session.flightId,
                userId: req.session.userId,
                passengers: req.session.passengers,
            }).toString();
            const url = 'http://127.0.0.1:7777/update/passengers?' + params;
            const response = await axios.get(url);
            console.log(response);

            return res.redirect(response.data);
        }
    );


     schedule.scheduleJob(req.session.userId,{ start: startTime, end: endTime, rule:'*/10 * * * *'}, async function(){
        console.log('uso');
        const params = new URLSearchParams({
            flightId: req.session.flightId,
            userId: req.session.userId,
            passengers: req.session.passengers,

           }).toString();
        const url = 'http://127.0.0.1:7777/update/passengers?' + params;  
        const response = await axios.get(url);
        console.log(response);
           
        return res.redirect(response.data);
      

     });
     
     next();
} 




exports.buyTicket = async (req, res) => {
    const ticket = new Ticket({
        userId: req.session.userId,
        flightId: req.session.flightId,

        purchase: new Date(),
    });
    
    await ticket.save();
    const params = new URLSearchParams({
        userId: req.session.userId,
        rank: req.session.miles,


       }).toString();

   

    let current_job = schedule.scheduledJobs[req.session.userId];


    current_job.cancel();
    const url = 'http://127.0.0.1:8000/update/rank?' + params;  
    axios

   .get(url)
    .then((response) => {
        res.redirect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });   


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
