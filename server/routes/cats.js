const express = require("express");
const router = express.Router();

router.get("/catProfile", (req, res) => {
  res.json({
    name: "Dave the magical cheese wizard",
    age: 3,
    mood: "magical",
    hungry: "yes",
    description: "Dave is the most truhest of cats yer eye shall ever see",
    imageUrl: "https://http.cat/200"
  })

});

router.get("/catCollection", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json({
    cats: [
      {
        id: 1,
        name: "Triesnha Ameilya",
        age: 2,
        gender: "female",
        mood: "sad",
        color: "black",
        breed: "Somewhere from Java, Indonesia",
        hungry: false,
        description: "Triesnha is a very sad cat",
        favoriteFood: "salmon",
        imageUrl: "https://http.cat/404",
        personality: "Humble, kind, and smart"
      },
      {
        id: 2,
        name: "Malte Szemlics",
        age: 3,
        gender: "male",
        mood: "magical",
        color: "brown",
        breed: "British Shorthair, somewhere from Germany",
        hungry: false,
        description: "Malte is the most truhest of cats yer eye shall ever see",
        favoriteFood: "cheese",
        imageUrl: "https://http.cat/200",
        personality: "Funny, energetic, and loyal"
      },
      {
        id: 3,
        name: "Vu Duc Le",
        age: 3.5,
        gender: "male",
        mood: "sad",
        color: "black",
        breed: "Persian Cat, somewhere from Vietnam",
        hungry: false,
        description: "Vu Duc is a very happy cat",
        imageUrl: "https://http.cat/400",
        favoriteFood: "sweets",
        personality: "Shy and cute"
      },
      {
        id: 4,
        name: "Julia Nguyen",
        age: 2.5,
        gender: "female",
        mood: "happy",
        color: "white",
        breed: "Persian Cat, somewhere from Vietnam",
        hungry: true,
        favoriteFood: "Cheeseburger",
        description: "Julia is a very happy cat",
        imageUrl: "https://http.cat/400",
        personality: "Shy and cute"
      },
      {
        id: 5,
        name: "Winston J. Reichelt",
        age: 4,
        gender: "male",
        mood: "happy",
        color: "black",
        breed: "British Shorthair, somewhere from Germany",
        hungry: 0,
        favoriteFood: "Cheeseburger",
        description: "Winston is a very happy cat",
        imageUrl: "https://http.cat/400",
        personality: "Happy and local"
      },
      {
        id: 6,
        name: "Sophia Kawgan Kagan",
        age: 4,
        gender: "female",
        mood: "happy",
        color: "black",
        breed: "British Shorthair, somewhere from Germany",
        hungry: 0,
        favoriteFood: "salad",
        description: "Winston is a very happy cat",
        imageUrl: "https://http.cat/400",
        personality: "Happy and local"
      },
      {
        id: 7,
        name: "Leticia Halm",
        age: 4,
        gender: "female",
        mood: "happy",
        color: "black",
        breed: "British Shorthair, somewhere from Germany",
        hungry: 0,
        favoriteFood: "sweets",
        description: "Winston is a very happy cat",
        imageUrl: "https://http.cat/400",
        personality: "Happy and local"
      },
    ]
  })
})

module.exports = router;
