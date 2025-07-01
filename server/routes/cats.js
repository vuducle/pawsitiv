/*
============================================================
😺 CATS ROUTES - server/routes/cats.js 😺
============================================================
Welcome to the Cat Command Center! 🐾
Here, we herd cats (and requests) like pros. 

Features:
- Create, read, update, and delete cats! (No actual cats were harmed)
- Handles all your feline API needs with purr-fection.
- If you see a bug, it's probably just a cat playing with the code. 🐛

Authors: Pawsitiv Team (Malte, Leticia, Sophia, Vu)
============================================================
*/
const express = require("express");
const router = express.Router();
const Cat = require('../models/Cat');

// CREATE a new cat
router.post('/', async (req, res) => {
  try {
    const cat = new Cat(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all cats
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single cat by ID
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Cat not found' });
    res.json(cat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a cat by ID
router.put('/:id', async (req, res) => {
  try {
    const cat = await Cat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ error: 'Cat not found' });
    res.json(cat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a cat by ID
router.delete('/:id', async (req, res) => {
  try {
    const cat = await Cat.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Cat not found' });
    res.json({ message: 'Cat deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
