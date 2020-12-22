const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/tickets', (req, res) => {
    res.render('layout');
});



module.exports = router;
