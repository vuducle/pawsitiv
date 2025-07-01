/*
============================================================
🔔 NOTIFICATIONS ROUTES - server/routes/notifications.js 🔔
============================================================
Welcome to the Notification Nook! 📬
Here, we deliver messages faster than a cat chasing a laser pointer.

Features:
- Create, read, update, and delete notifications!
- Never miss a meowment again. 🕒
- If you get too many notifications, blame the cat. 🐾

Authors: Pawsitiv Team (Malte, Leticia, Sophia, Vu)
============================================================
*/
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// CREATE a new notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a notification by ID
router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a notification by ID
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 