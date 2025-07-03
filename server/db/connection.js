// db/connection.js

const mongoose = require("mongoose");

let isConnecting = false;
let retryTimeoutId = null;

/**
 * Establishes a connection to MongoDB with retry logic.
 * @returns {Promise<void>} A promise that resolves when connected, or rejects if max retries are exceeded.
 */
const connectDB = async () => {
    if (isConnecting) {
        console.log('🔄 MongoDB-Verbindungsversuch läuft bereits. Überspringe neuen Versuch.');
        return;
    }

    isConnecting = true;

    const maxRetries = parseInt(process.env.MONGODB_CONNECTION_RETRIES || '10', 10);
    const retryDelay = parseInt(process.env.MONGODB_CONNECTION_DELAY || '5000', 10);
    let currentRetryCount = 0;

    const connectWithRetry = async () => {
        // Clear any existing retry timeout to prevent multiple concurrent retries
        if (retryTimeoutId) {
            clearTimeout(retryTimeoutId);
            retryTimeoutId = null;
        }

        try {
            console.log(`Connecting to MongoDB... (Attempt ${currentRetryCount + 1}/${maxRetries})`);
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pawsitiv';

            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000, // Timeout for initial server discovery
                socketTimeoutMS: 45000,       // How long a socket can remain idle before closing
            });

            console.log('✅ MongoDB connected successfully');
            isConnecting = false;
            currentRetryCount = 0; // Reset retry counter on success
        } catch (error) {
            currentRetryCount++;
            console.error(`❌ MongoDB connection error: ${error.message}`);

            if (currentRetryCount < maxRetries) {
                console.log(`⌛ Retrying in ${retryDelay / 1000} seconds...`);
                // Schedule the next retry
                retryTimeoutId = setTimeout(connectWithRetry, retryDelay);
            } else {
                console.error('💥 FATAL: Failed to connect to MongoDB after multiple attempts');
                // In a real application, you might want to emit an event or throw an error here
                // instead of immediately exiting, to allow for more graceful shutdown handling.
                isConnecting = false;
                throw new Error('Failed to connect to MongoDB after multiple attempts'); // Throw for testability
            }
        }
    };

    // Start the initial connection attempt
    await connectWithRetry();
};

/**
 * Sets up event listeners for Mongoose connection.
 */
const setupMongoEvents = () => {
    mongoose.connection.on('connected', () => {
        console.log('📡 MongoDB connection active');
    });

    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
        // When disconnected, attempt to reconnect
        connectDB();
    });

    mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB general connection error: ${err.message}`);
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔁 MongoDB reconnected');
    });
};

/**
 * Closes the MongoDB connection and clears any pending retry timeouts.
 * This is useful for graceful shutdown and testing.
 */
const closeDB = async () => {
    if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
    }
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed');
    }
    // Reset connection state for future calls (e.g., in tests)
    isConnecting = false;
};

module.exports = {
    connectDB,
    setupMongoEvents,
    closeDB,
};
