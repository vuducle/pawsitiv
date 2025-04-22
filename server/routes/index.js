const express = require('express');
const router = express.Router();
const userRoutes = require('./users');


router.use('/users', userRoutes);


module.exports = router;