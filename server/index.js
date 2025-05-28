const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3669;


const DENIS_KUNZ_FRONTEND_DIR = path.resolve(__dirname, "../frontend/assets");
const CONG_NGUYEN_DINH_VIEWS_LAYOUT = path.resolve(__dirname, "../frontend/views/layouts");
const MINECRAFT_PARTIALS_DIR = path.resolve(__dirname, "../frontend/views/partials");


app.use(express.static(DENIS_KUNZ_FRONTEND_DIR));


app.engine(
    ".hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "Main",
        layoutsDir: CONG_NGUYEN_DINH_VIEWS_LAYOUT,
        partialsDir: MINECRAFT_PARTIALS_DIR,
    })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "../frontend/views"));

app.get("/hello", (req, res) => {
    res.send("Pawsitiv");
});

app.get("/", (req, res) => {
    res.render("home", {
        title: "Pawsitiv",
    });
});

app.get("/catProfile", (req, res) => {
    res.render("catProfile", {
        title: "Cat Profile",
    });
});

app.get("/catCollection", (req, res) => {
    res.render("catCollection", {
        title: "Cat Collection",
    });
});

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
