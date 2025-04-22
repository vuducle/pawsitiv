const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // res.send('List from users.js');
    res.render('home', { // 'home' refers to views/home.hbs
        title: 'Users Pawsitiv',
    });
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User with ID: ${userId}`);
});

module.exports = router;