const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');

//alle Umfragen anzeigen (READ)
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (err) {
        res.status(500).json({error: 'Fehler beim Laden der Umfragen'});
    }
});

//Neue Umfrage erstellen
router.post('/', async (req, res) => { 
    const { question } = req.body;

    try{
        const newPoll = new Poll({ question });
        const savedPoll = await newPoll.save();
        res.status(201).json(savedPoll);
    } catch (err) {
        res.status(400).json({ error: 'Fehler beim Erstellen der Umfrage'});
    }
 });

 module.exports = router;