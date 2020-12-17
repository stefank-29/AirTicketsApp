const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/admin', (req, res) => {
    res.send('hi');
});

module.exports = router;

