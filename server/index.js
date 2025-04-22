const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars')
const app = express();
const routes = require('./routes');
const port = process.env.PORT || 3669;

// CONSTANTS FOR THE PATHS BRAH
const DENIS_KUNZ_FRONTEND_DIR = path.resolve(__dirname, '../frontend/assets');
const CONG_NGUYEN_DINH_VIEWS_LAYOUT= path.resolve(__dirname, '../frontend/views/layouts');
const MINECRAFT_PARTIALS_DIR = path.resolve(__dirname, '../frontend/views/partials');

app.get("/hello", (req, res) => {
    // We could get a "response" if we change it to "/" or open the path "/hello" to fix the error
    res.send("Pawsitiv");
})

app.use(express.static(DENIS_KUNZ_FRONTEND_DIR));
/* START OF HANDLEBARS !IMPORTANT */
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayouts: 'Main',
    layoutsDir: CONG_NGUYEN_DINH_VIEWS_LAYOUT,
    partialsDir: MINECRAFT_PARTIALS_DIR
}))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '../frontend/views'));
/* END OF HANDLEBARS */

// WE WILL ADD MORE ROUTES LATER!!!
app.get('/', (req, res) => {
    // Render the 'home.hbs' view
    // Pass the data object (context) to the template
    res.render('home', { // 'home' refers to views/home.hbs
        title: 'Pawsitiv',
    });
});
app.use('/', routes);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
})
