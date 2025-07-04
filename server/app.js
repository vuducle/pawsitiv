const express = require("express");
const routes = require("./routes");
const polls = require('./routes/polls');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.use('/polls', polls);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Pawsitiv Backend API!",
        version: "1.0.0",
    });
});

module.exports = app; 