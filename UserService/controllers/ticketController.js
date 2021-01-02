const mongoose = require('mongoose');
const User = mongoose.model('User');
const axios = require('axios');

exports.ticketsPage = (req, res) => {
    res.render('myTickets', { title: 'My Tickets' });
};

exports.buyTicket = async (req, res) => {
    const user = await User.findOne({ _id: res.locals.user.id });
    req.session.flightId = req.params.id;
    req.session.id = user.id;
    const params = new URLSearchParams({
        flightId: req.params.id,
        userId: user.id,
        passengers: req.session.passengers,
    }).toString();
    const url = 'http://127.0.0.1:8080/tickets?' + params;
    axios
        .get(url)
        .then((response) => {
            res.redirect(response.config.url);
        })
        .catch((error) => {
            console.log(error);
        });
};
