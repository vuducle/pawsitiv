// server/index.js
const mongoose = require("mongoose");
const { connectDB, setupMongoEvents, closeDB } = require("./db/connection");
const app = require("./app");

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

// --- Graceful Shutdown ---
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
