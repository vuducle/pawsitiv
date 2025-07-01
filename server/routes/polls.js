/*
============================================================
📊 POLLS ROUTES - server/routes/polls.js 📊
============================================================
Welcome to the Polling Palace! 🏰
Where opinions are gathered faster than a cat finds a box.

Features:
- Create and read polls!
- Collects answers with the curiosity of a kitten. 🐱
- If the results are weird, the cat probably voted. 🗳️

Authors: Pawsitiv Team (Malte, Leticia, Sophia, Vu)
============================================================
*/
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