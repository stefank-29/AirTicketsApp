const express = require('express');
const router = express.Router();
const axios = require('axios');
const adminController = require('../controllers/adminController');
const searchController = require('../controllers/searchControllers');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/admin', (req, res) => {
    res.render('layout');
});

router.get('/admin/dashboard', adminController.adminDashboard);

router.get('/admin/add/airplane', adminController.addAirplaneForm);

router.get('/admin/add/flight', adminController.addFlightForm);


router.get('/admin/dashboard/flights', catchErrors(adminController.getFlights));
router.get('/admin/dashboard/airplanes', catchErrors(adminController.getAirplanes));

router.get('/search', catchErrors(searchController.searchFlight));
router.post('/search', searchController.searchFlight);



module.exports = router;
