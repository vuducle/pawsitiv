// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
// const {seedUsers} = require("./db/seedUsers"); // Importiert deine API-Routen (z.B. user-Routen)

const port = process.env.PORT || 3669;

// --- MongoDB Verbindungs- und Wiederverbindungslogik ---
let isConnecting = false;
let retryTimeoutId = null;

const connectDB = async () => {
    if (isConnecting) {
        console.log('🔄 MongoDB-Verbindungsversuch läuft bereits. Überspringe neuen Versuch.');
        return;
    }

    isConnecting = true;

    const maxRetries = parseInt(process.env.MONGODB_CONNECTION_RETRIES) || 10; // Mehr Retries für Robustheit
    const retryDelay = parseInt(process.env.MONGODB_CONNECTION_DELAY) || 5000;
    let currentRetryCount = 0;

    const connectWithRetry = async () => {
        if (retryTimeoutId) {
            clearTimeout(retryTimeoutId);
            retryTimeoutId = null;
        }

        try {
            console.log(`Connecting to MongoDB... (Attempt ${currentRetryCount + 1}/${maxRetries})`);
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pawsitiv';

            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            console.log('✅ MongoDB connected successfully');
            isConnecting = false;
            currentRetryCount = 0; // Zähler zurücksetzen bei Erfolg
        } catch (error) {
            currentRetryCount++;
            console.error(`❌ MongoDB connection error: ${error.message}`);

            if (currentRetryCount < maxRetries) {
                console.log(`⌛ Retrying in ${retryDelay/1000} ms...`);
                retryTimeoutId = setTimeout(connectWithRetry, retryDelay);
            } else {
                console.error('💥 FATAL: Failed to connect to MongoDB after multiple attempts');
                console.error('Shutting down server...');
                isConnecting = false;
                process.exit(1); // Server beenden bei kritischem Fehler
            }
        }
    };

    await connectWithRetry();
};

const setupMongoEvents = () => {
    mongoose.connection.on('connected', () => {
        console.log('📡 MongoDB connection active');
    });

    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
        connectDB(); // Versucht erneut zu verbinden
    });

    mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB general connection error: ${err.message}`);
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔁 MongoDB reconnected');
    });
};

// Datenbankverbindung initialisieren und Events einrichten
(async () => {
    try {
        await connectDB();
        // seedUsers(); // <--- DIESEN AUFRUF ENTFERNT LASSEN!
        // Nutze 'docker compose run --rm seeder' für das Seeding.
        setupMongoEvents();
    } catch (error) {
        console.error('💥 Critical DB connection failure:', error);
        process.exit(1);
    }
})();

// --- Middleware ---
app.use(express.json()); // Ermöglicht das Parsen von JSON-Anfragen im Request Body
app.use(express.urlencoded({ extended: true })); // Ermöglicht das Parsen von URL-kodierten Anfragen
app.use("/api", routes);
// --- API-Routen ---
// Die Hauptroute des Backends gibt jetzt eine JSON-Begrüßung zurück.
// Dein Next.js-Frontend wird hier keine HTML-Seite erwarten.
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Pawsitiv Backend API!",
        version: "1.0.0",
        // documentation: "/api/docs" // Optional: Hinweis auf API-Dokumentation
    });
});

// Health Check Endpoint: Gibt den Status des Servers und der Datenbank zurück
app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        status: dbStatus === 'connected' ? 'OK' : 'WARNING',
        server: 'running',
        database: dbStatus,
        uptime: process.uptime(), // Server-Uptime in Sekunden
        timestamp: new Date().toISOString()
    });
});

// Alle deine spezifischen API-Routen (z.B. User-Routen) werden unter dem '/api'-Präfix gebündelt.
// Wenn z.B. 'routes/users.js' eine Route für '/' (alle Benutzer) definiert,
// ist sie dann über '/api/users' erreichbar.


// --- Graceful Shutdown ---
// Behandelt SIGINT-Signale (z.B. Strg+C), um eine saubere Abschaltung zu ermöglichen.
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    try {
        if (retryTimeoutId) {
            clearTimeout(retryTimeoutId); // Laufenden Wiederverbindungsversuch abbrechen
        }
        await mongoose.connection.close(); // MongoDB-Verbindung schließen
        console.log('📴 MongoDB connection closed');
        process.exit(0); // Erfolgreich beendet
    } catch (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1); // Mit Fehler beendet
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://admin:pawsitiv123@localhost:27017/pawsitiv?authSource=admin'}`);
});