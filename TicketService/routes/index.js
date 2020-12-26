const express = require('express');
const router = express.Router();
const axios = require('axios');
const ticketController = require('../controllers/ticketController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/tickets', ticketController.storeQuery);

router.get('/tickets/buy', catchErrors(ticketController.infoTicket), ticketController.buyForm);

router.get('/user/:id/addcard', ticketController.addCard);

module.exports = router;
