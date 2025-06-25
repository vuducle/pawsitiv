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

module.exports = router;