const express = require('express');
const router = express.Router();
const axios = require('axios');
const ticketController = require('../controllers/ticketController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/tickets', ticketController.storeQuery);

router.get('/tickets/buy', catchErrors(ticketController.infoTicket), ticketController.buyForm);
router.post('/tickets/buy', catchErrors(ticketController.buyTicket));

router.get('/user/card/add', ticketController.addCard);

router.get('/redirect/home',catchErrors(ticketController.homeRedirect));

module.exports = router;
