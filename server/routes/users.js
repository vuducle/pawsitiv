/*
============================================================
👤 USERS ROUTES - server/routes/users.js 👤
============================================================
Welcome to the User Universe! 🌌
Where users are managed with the grace of a cat landing on its feet.

Features:
- Create, read, update, and delete users!
- Handles user data with paws and claws. 🐾
- If something goes wrong, it was the cat's fault. 😹

Authors: Pawsitiv Team (Malte, Leticia, Sophia, Vu)
============================================================
*/
// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Pfad zum User-Model anpassen, falls nötig!

// ---
// Route: GET /users/
// Beschreibung: Ruft alle Benutzer ab
// ---
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}); // Alle Benutzer aus der Datenbank abrufen
         res.send(users); // Sende die Benutzer als JSON

    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        res.status(500).send('Fehler beim Abrufen der Benutzer.');
    }
});

// ---
// Route: GET /users/:id
// Beschreibung: Ruft einen einzelnen Benutzer anhand seiner ID ab
// ---
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId); // Benutzer anhand der ID abrufen

        if (!user) {
            return res.status(404).send('Benutzer nicht gefunden.');
        }
        res.send(user); // Sende den Benutzer als JSON

    } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        // Prüfen, ob der Fehler durch eine ungültige ID verursacht wurde
        if (error.name === 'CastError') {
            return res.status(400).send('Ungültige Benutzer-ID.');
        }
        res.status(500).send('Fehler beim Abrufen des Benutzers.');
    }
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;