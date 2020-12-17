const express = require('express');
const router = express.Router();
const User = require('../models/User')
const mongoose = require('mongoose');

router.get('/' ,(req,res)=>{
    res.send('admin');
})

module.exports = router;