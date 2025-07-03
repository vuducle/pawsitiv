// server/index.js
const express = require("express");
const mongoose = require("mongoose"); // Still needed for mongoose.connection.readyState etc.
const { connectDB, setupMongoEvents, closeDB } = require("./db/connection"); // Import from new module
const app = express();
const routes = require("./routes");
const polls = require('./routes/polls');

const port = process.env.PORT || 3669;

// --- Database Connection Initialization ---
(async () => {
    try {
        await connectDB(); // Call the exported connectDB function
        setupMongoEvents(); // Call the exported setupMongoEvents function
    } catch (error) {
        console.error('💥 Critical DB connection failure:', error);
        process.exit(1);
    }
})();

// --- Middleware ---
app.use(express.json()); // Enables parsing of JSON request bodies
app.use(express.urlencoded({ extended: true })); // Enables parsing of URL-encoded request bodies
app.use("/api", routes);
app.use('/polls', polls);

// --- API Routes ---
// The main backend route now returns a JSON greeting.
// Your Next.js frontend will not expect an HTML page here.
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Pawsitiv Backend API!",
        version: "1.0.0",
        // documentation: "/api/docs" // Optional: Hint for API documentation
    });
});

// Health Check Endpoint: Returns the status of the server and database
app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        status: dbStatus === 'connected' ? 'OK' : 'WARNING',
        server: 'running',
        database: dbStatus,
        uptime: process.uptime(), // Server uptime in seconds
        timestamp: new Date().toISOString()
    });
});

// --- Graceful Shutdown ---
// Handles SIGINT signals (e.g., Ctrl+C) to allow for a clean shutdown.
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    try {
        await closeDB(); // Call the exported closeDB function
        process.exit(0); // Exit successfully
    } catch (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1); // Exit with error
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://admin:pawsitiv123@localhost:27017/pawsitiv?authSource=admin'}`);
});
