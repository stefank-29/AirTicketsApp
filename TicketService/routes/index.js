const express = require('express');
const router = express.Router();
const axios = require('axios');
const ticketController = require('../controllers/ticketController');

router.get('/tickets', ticketController.storeQuery);

router.get('/tickets/buy',ticketController.buyTicket , (req,res) => {
    res.render('layout');
});


module.exports = router;
