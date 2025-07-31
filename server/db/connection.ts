import mongoose, { Connection } from "mongoose";

let isConnecting = false;
let retryTimeoutId: NodeJS.Timeout | null = null;

/**
 * Establishes a connection to MongoDB with retry logic.
 * @returns {Promise<void>} A promise that resolves when connected, or rejects if max retries are exceeded.
 */
export const connectDB = async (): Promise<void> => {
  if (isConnecting) {
    console.log(
      "🔄 MongoDB-Verbindungsversuch läuft bereits. Überspringe neuen Versuch."
    );
    return;
  }

  isConnecting = true;

  const maxRetries = parseInt(
    process.env.MONGODB_CONNECTION_RETRIES || "10",
    10
  );
  const retryDelay = parseInt(
    process.env.MONGODB_CONNECTION_DELAY || "5000",
    10
  );
  let currentRetryCount = 0;

  const connectWithRetry = async () => {
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }
    try {
      console.log(
        `Connecting to MongoDB... (Attempt ${
          currentRetryCount + 1
        }/${maxRetries})`
      );
      const mongoURI =
        process.env.MONGODB_URI || "mongodb://localhost:27017/pawsitiv";
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB connected successfully");
      isConnecting = false;
      currentRetryCount = 0;
    } catch (error: any) {
      currentRetryCount++;
      console.error(`❌ MongoDB connection error: ${error.message}`);
      if (currentRetryCount < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
        retryTimeoutId = setTimeout(connectWithRetry, retryDelay);
      } else {
        console.error(
          "💥 FATAL: Failed to connect to MongoDB after multiple attempts"
        );
        isConnecting = false;
        throw new Error("Failed to connect to MongoDB after multiple attempts");
      }
    }
  };
  await connectWithRetry();
};

/**
 * Sets up event listeners for Mongoose connection.
 */
export const setupMongoEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("📡 MongoDB connection active");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected. Attempting to reconnect...");
    connectDB();
  });
  mongoose.connection.on("error", (err: any) => {
    console.error(`❌ MongoDB general connection error: ${err.message}`);
  });
  mongoose.connection.on("reconnected", () => {
    console.log("🔁 MongoDB reconnected");
  });
};

/**
 * Closes the MongoDB connection and clears any pending retry timeouts.
 * This is useful for graceful shutdown and testing.
 */
export const closeDB = async (): Promise<void> => {
  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId);
    retryTimeoutId = null;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
  }
  isConnecting = false;
};
