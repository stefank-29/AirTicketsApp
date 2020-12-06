const mongoose = require('mongoose');

exports.ticketsPage = (req, res) => {
    res.render('tickets', { title: 'Tickets' });
};
