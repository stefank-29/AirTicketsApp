const express = require('express');
const router = express.Router();
const User = require('../models/User')
const mongoose = require('mongoose');
const axios = require('axios');

router.get('/' ,(req,res)=>{
    axios.get(process.env.SERVICE_2).then((response)=>{
       
       res.redirect(response.config.url);
    }).catch(error => {
        console.log(error);
    });
})


module.exports = router;