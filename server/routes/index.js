const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const catsRoutes = require('./cats');

// url -> localhost/api/users/... der andere kram was danach kommt
router.use('/users', userRoutes);
// url -> localhost/api/cats/... der andere kram
// --- wir gehen erstmal voraus wir arbeiten hier ---
router.use('/cats', catsRoutes);

module.exports = router;