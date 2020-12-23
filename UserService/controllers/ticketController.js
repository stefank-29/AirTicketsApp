const mongoose = require('mongoose');
const User = mongoose.model('User');
const axios = require('axios');



exports.ticketsPage = (req, res) => {
    res.render('tickets', { title: 'Tickets' });
};

exports.buyTicket = (req,res) => {
    axios.get(process.env.SERVICE_3).then((response)=>{
       
        res.redirect(response.config.url);
     }).catch(error => {
         console.log(error);
     });
    
}
