/*
============================================================
🚦 ROUTES INDEX - server/routes/index.js 🚦
============================================================
Welcome to the Route Roundabout! 🛣️
Directing traffic like a cat herder at rush hour.

Features:
- Connects all the pawsome API routes together!
- Keeps your endpoints organized and your cats in line. 🐈
- If you get lost, follow the catnip trail. 🌿

Authors: Pawsitiv Team (Malte, Leticia, Sophia, Vu)
============================================================
*/
const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const catsRoutes = require('./cats');
const notificationRoutes = require('./notifications');


// url -> localhost/api/users/... der andere kram was danach kommt
router.use('/users', userRoutes);
// url -> localhost/api/cats/... der andere kram
// --- wir gehen erstmal voraus wir arbeiten hier ---
router.use('/cats', catsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;