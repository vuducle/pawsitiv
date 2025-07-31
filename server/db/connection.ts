import { Pool, PoolClient } from "pg";

let pool: Pool | null = null;
let isConnecting = false;
let retryTimeoutId: NodeJS.Timeout | null = null;

/**
 * Establishes a connection to PostgreSQL with retry logic.
 * @returns {Promise<void>} A promise that resolves when connected, or rejects if max retries are exceeded.
 */
export const connectDB = async (): Promise<void> => {
  if (isConnecting) {
    console.log(
      "🔄 PostgreSQL connection attempt already running. Skipping new attempt."
    );
    return;
  }

  isConnecting = true;

  const maxRetries = parseInt(
    process.env.POSTGRES_CONNECTION_RETRIES || "10",
    10
  );
  const retryDelay = parseInt(
    process.env.POSTGRES_CONNECTION_DELAY || "5000",
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
        `Connecting to PostgreSQL... (Attempt ${
          currentRetryCount + 1
        }/${maxRetries})`
      );

      pool = new Pool({
        user: process.env.POSTGRES_USER || "postgres",
        host: process.env.POSTGRES_HOST || "localhost",
        database: process.env.POSTGRES_DB || "pawsitiv",
        password: process.env.POSTGRES_PASSWORD || "pawsitiv123",
        port: parseInt(process.env.POSTGRES_PORT || "5432"),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      const client = await pool.connect();
      await client.query("SELECT NOW()");
      client.release();

      console.log("✅ PostgreSQL connected successfully");
      isConnecting = false;
      currentRetryCount = 0;
    } catch (error: any) {
      currentRetryCount++;
      console.error(`❌ PostgreSQL connection error: ${error.message}`);
      if (currentRetryCount < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
        retryTimeoutId = setTimeout(connectWithRetry, retryDelay);
      } else {
        console.error(
          "💥 FATAL: Failed to connect to PostgreSQL after multiple attempts"
        );
        isConnecting = false;
        throw new Error(
          "Failed to connect to PostgreSQL after multiple attempts"
        );
      }
    }
  };
  await connectWithRetry();
};

/**
 * Gets the database pool instance.
 * @returns {Pool} The PostgreSQL pool instance.
 */
export const getPool = (): Pool => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return pool;
};

/**
 * Gets a client from the pool.
 * @returns {Promise<PoolClient>} A PostgreSQL client.
 */
export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return await pool.connect();
};

/**
 * Sets up event listeners for PostgreSQL connection.
 */
export const setupPostgresEvents = () => {
  if (!pool) return;

  pool.on("connect", (client: PoolClient) => {
    console.log("📡 PostgreSQL client connected");
  });

  pool.on("error", (err: Error) => {
    console.error(`❌ PostgreSQL pool error: ${err.message}`);
  });

  pool.on("remove", (client: PoolClient) => {
    console.log("⚠️ PostgreSQL client removed from pool");
  });
};

/**
 * Closes the PostgreSQL connection and clears any pending retry timeouts.
 * This is useful for graceful shutdown and testing.
 */
export const closeDB = async (): Promise<void> => {
  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId);
    retryTimeoutId = null;
  }
  if (pool) {
    await pool.end();
    console.log("📴 PostgreSQL connection closed");
    pool = null;
  }
  isConnecting = false;
};
