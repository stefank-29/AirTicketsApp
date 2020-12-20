const mongoose = require('mongoose');
const Flight = mongoose.model('Flight');


exports.searchFlight = (req,res) => {
    res.send(req.query);                    
} 