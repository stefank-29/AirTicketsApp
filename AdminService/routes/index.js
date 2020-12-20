const express = require('express');
const router = express.Router();
const axios = require('axios');
const adminController = require('../controllers/adminController');
const searchController = require('../controllers/searchControllers');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/admin', (req, res) => {
    res.render('layout');
});

router.get('/admin/dashboard');


router.get('/admin/add/airplane', adminController.addAirplaneForm);
router.post('/admin/add/airplane', catchErrors(adminController.addAirplane));

router.get('/admin/add/flight', adminController.addFlightForm);
router.post('/admin/add/flight', catchErrors(adminController.addFlight));

router.get('/search', (req,res)=>{
    
})
router.post('/search', searchController.searchFlight);


module.exports = router;
