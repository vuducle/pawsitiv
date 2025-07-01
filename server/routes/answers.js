const express = require('express');
const router = require('express').Router({ mergeParams: true });
const Answer = require('../models/Answer');

// Alle Antworten zu einer Poll lesen
router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find({ poll: req.params.pollId });
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der Antworten' });
    }
});

// Neue Antwort zu einer Poll erstellen
router.post('/', async (req, res) => {
  const { pollId } = req.params;
  const { text } = req.body;

  try {
    const newAnswer = new Answer({ poll: pollId, text });
    const savedAnswer = await newAnswer.save();
    res.status(201).json(savedAnswer);
  } catch (err) {
    res.status(400).json({ error: 'Fehler beim Erstellen der Antwort' });
  }
});

module.exports = router;

