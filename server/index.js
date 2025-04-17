const express = require('express');
const app = express();
const port = process.env.PORT || 3669;

app.get("/hello", (req, res) => {
    // We could get a "response" if we change it to "/" or open the path "/hello" to fix the error
    res.send("Pawsitiv");
})

app.listen(port, () => {
    console.log("Server is running on port: " + port);
})
