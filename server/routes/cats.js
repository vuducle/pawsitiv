const express = require("express");
const router = express.Router();

router.get("/catProfile", (req, res) => {
  // Render the 'catProfile.hbs' view
  // Pass the data object (context) to the template
  res.render("catProfile", {
    // 'catProfile' refers to views/catProfile.hbs
    name: "Dave the magical cheese wizard",
    age: 3,
    mood: "magical",
    hungry: "yes",
    description: "Dave is the most truhest of cats yer eye shall ever see",
  });
});

router.get("/catCollection", (req, res) => {
  // Render the 'catProfile.hbs' view
  // Pass the data object (context) to the template
  res.render("catCollection", {
    // 'catProfile' refers to views/catProfile.hbs
    name: "Malte, Sophia, Leticia, Vu",
  });
});

module.exports = router;
