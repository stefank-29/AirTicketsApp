const express = require('express');
const router = express.Router();
const User = require('../models/User')
const mongoose = require('mongoose');
const axios = require('axios');

router.get('/' ,(req,res)=>{
    axios.get('http://127.0.0.1:7777/admin').then((response)=>{
        
       res.redirect(response.config.url);
    }).catch(error => {
        console.log(error);
    });
})

module.exports = router;