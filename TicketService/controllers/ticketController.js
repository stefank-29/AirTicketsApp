const mongoose = require('mongoose');
const Ticket = mongoose.model('Tickets');
const axios = require('axios');
const { response } = require('express');

exports.storeQuery = (req, res) => {
    req.session.flightId = req.query.flightId;
    req.session.userId = req.query.userId;

    res.redirect('/tickets/buy');
};

exports.infoTicket = async (req, res, next) => {
    let user,flight;
    const params = new URLSearchParams({
        flightId: req.session.flightId,
        userId: req.session.userId,
    }).toString();
    const url = 'http://127.0.0.1:8000/getInfo?' + params;

    const respUser = await axios.get(url);

    req.user = respUser.data;
         
    const urlService2 = 'http://127.0.0.1:7777/getInfo?' + params;

    const respFlight = await axios.get(urlService2); 
   
        
    next();
};

exports.buyTicket = async (req,res) => {
    const ticket = new Ticket({
        userId: req.session.userId,
        flightId: req.session.flightId,
        purchase: new Date()

    });
    
    await ticket.save();

    next();
}