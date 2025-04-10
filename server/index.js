const express = require('express');
const app = express();
const port = process.env.PORT || 3669;

app.get("/", (req, res) => {
    res.send("Pawsitiv");
})

app.listen(port, () => {
    console.log("Server is running on port: " + port);
})
