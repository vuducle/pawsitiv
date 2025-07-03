// @ts-check
// __tests__/dbConnection.test.js (or similar path)

/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import { connectDB, setupMongoEvents, closeDB } from "../db/connection"; // Adjust path as needed

// Store original console methods to restore them after tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Database Connection Logic (connectDB)", () => {
  /**
   * @type {jest.SpyInstance<Promise<typeof mongoose>, [string, mongoose.ConnectOptions?]>}
   * Spy for `mongoose.connect`.
   * It takes a string (URI) and an optional `mongoose.ConnectOptions` object, and returns a Promise resolving to the mongoose instance.
   */
  let mongooseConnectSpy: any;
  /**
   * @type {jest.SpyInstance<void, any[]>}
   * Spy for `console.log`. It returns void and takes any number of arguments.
   */
  let consoleLogSpy: any;
  /**
   * @type {jest.SpyInstance<void, any[]>}
   * Spy for `console.error`. It returns void and takes any number of arguments.
   */
  let consoleErrorSpy: any;

  // Store original process.env values to restore them later, ensuring test isolation
  const originalEnv = process.env;

  beforeEach(() => {
    // Clear all mock calls and instances before each test to ensure a clean slate
    jest.clearAllMocks();
    // Reset module registry, important for re-importing modules with mocked `process.env`
    jest.resetModules();

    // Mock `mongoose.connect` to prevent actual database connections during tests.
    // By default, it resolves immediately to simulate a successful connection.
    // It should resolve with the mongoose object itself, as that's what mongoose.connect returns.
    mongooseConnectSpy = jest
      .spyOn(mongoose, "connect")
      .mockResolvedValue(mongoose); // Changed from `true` to `mongoose`

    // Spy on `console.log` and `console.error` to suppress output during tests
    // and optionally assert on their calls if needed for specific test cases.
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Set up mock environment variables for the current test run.
    // This allows controlling connection parameters like URI, retry count, and delay.
    process.env = {
      ...originalEnv, // Preserve other environment variables
      MONGODB_URI: "mongodb://mockhost:27017/mockdb",
      MONGODB_CONNECTION_RETRIES: "3", // Use a low retry count for faster test execution
      MONGODB_CONNECTION_DELAY: "10", // Use a very short delay for tests
    };

    // Ensure Mongoose is disconnected before each test, in case a previous test
    // left it in a connected state (though mocks should prevent actual connections).
    if (mongoose.connection.readyState !== 0) {
      mongoose.disconnect();
    }
  });

  afterEach(async () => {
    // Ensure any pending timeouts from the `connectWithRetry` logic are cleared.
    // This is critical to prevent Jest from hanging if a retry was scheduled.
    await closeDB(); // `closeDB` function handles clearing internal timeouts and closing connection

    // Restore original `console` methods to avoid affecting subsequent test files or global console behavior
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Restore original `process.env` to its state before the test, ensuring isolation
    process.env = originalEnv;
  });

  test("should successfully connect to MongoDB on the first attempt", async () => {
    await connectDB();

    // Verify that `mongoose.connect` was called exactly once
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
    // Verify `mongoose.connect` was called with the mocked URI and an options object
    expect(mongooseConnectSpy).toHaveBeenCalledWith(
      "mongodb://mockhost:27017/mockdb",
      expect.any(Object) // Checks that an object was passed as the second argument
    );

    // Verify that the success message was logged to the console
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "✅ MongoDB connected successfully"
    );
  });

  test("should retry connection multiple times on initial failures and eventually succeed", async () => {
    // Configure `mongoose.connect` to fail twice, then succeed on the third call.
    mongooseConnectSpy
      .mockRejectedValueOnce(new Error("Connection failed 1")) // First call fails
      .mockRejectedValueOnce(new Error("Connection failed 2")) // Second call fails
      .mockResolvedValueOnce(mongoose); // Third call succeeds, changed from `true` to `mongoose`

    await connectDB();

    // Expect `mongoose.connect` to have been called three times in total
    // (initial attempt + two retries).
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(3);

    // Verify console output for each retry attempt and the final success message.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "❌ MongoDB connection error: Connection failed 1"
      )
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("⌛ Retrying in 0.01 seconds...")
    ); // Matches the mocked MONGODB_CONNECTION_DELAY of "10" ms
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "❌ MongoDB connection error: Connection failed 2"
      )
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "✅ MongoDB connected successfully"
    );
  });

  test("should throw an error if max retries are exceeded without successful connection", async () => {
    // Make `mongoose.connect` always reject, simulating persistent connection failures.
    mongooseConnectSpy.mockRejectedValue(
      new Error("Permanent connection failure")
    );

    // Override `MONGODB_CONNECTION_RETRIES` to a very low count (1 retry after initial attempt)
    // to quickly trigger the fatal error condition.
    process.env.MONGODB_CONNECTION_RETRIES = "1";

    // Expect `connectDB` to throw the specific error message indicating connection failure
    // after exhausting all retry attempts.
    await expect(connectDB()).rejects.toThrow(
      "Failed to connect to MongoDB after multiple attempts"
    );

    // Expect `mongoose.connect` to have been called twice (initial attempt + one retry).
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(2);

    // Verify the fatal error message was logged to the console.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "💥 FATAL: Failed to connect to MongoDB after multiple attempts"
      )
    );
  });

  test("should not attempt to connect if a connection attempt is already in progress", async () => {
    // Mock the first `mongoose.connect` call to resolve after a delay.
    // This simulates an ongoing connection process.
    mongooseConnectSpy.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(mongoose), 50)) // Changed to resolve with mongoose
    );

    // Call `connectDB` twice very quickly. The second call should be skipped
    // because `isConnecting` flag (internal to `db/connection.js`) will be true.
    const promise1 = connectDB(); // First call initiates connection
    const promise2 = connectDB(); // Second call should detect ongoing connection and skip

    // Wait for both promises to settle.
    await Promise.all([promise1, promise2]);

    // Expect `mongoose.connect` to have been called only once, confirming the second call was skipped.
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
    // Verify the console log indicating that a connection attempt is already in progress.
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "🔄 MongoDB-Verbindungsversuch läuft bereits. Überspringe neuen Versuch."
    );
  });

  test("setupMongoEvents should register Mongoose connection event listeners", () => {
    // Spy on `mongoose.connection.on` to check if event listeners are correctly registered.
    const onSpy = jest.spyOn(mongoose.connection, "on");
    //   .mockImplementation((e:any) => {
    //     console.log("-hi")
    //   }); // Mock implementation to prevent actual listener registration affecting tests

    setupMongoEvents();

    // Verify that listeners for 'connected', 'disconnected', 'error', and 'reconnected' events are registered.
    expect(onSpy).toHaveBeenCalledWith("connected", expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith("disconnected", expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith("error", expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith("reconnected", expect.any(Function));

    onSpy.mockRestore(); // Restore the spy to clean up
  });

  test("closeDB should close mongoose connection and clear any pending retry timeouts", async () => {
    // Ensure a mock connection is established so `closeDB` has something to close.
    await connectDB();

    // Spy on `mongoose.connection.close` to verify it's called.
    const closeSpy = jest.spyOn(mongoose.connection, "close");
    //   .mockResolvedValue(true);
    // Spy on `global.clearTimeout` to check if any pending timeouts are cleared.
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    // Note: Simulating a pending retry timeout directly here is challenging
    // without exposing `retryTimeoutId` from `db/connection.js`.
    // However, `closeDB` is designed to clear it internally if set.
    // This test primarily verifies `mongoose.connection.close` and `clearTimeout`
    // being called if a timeout *were* active.

    await closeDB();

    // Verify `mongoose.connection.close` was called once.
    expect(closeSpy).toHaveBeenCalledTimes(1);
    // Verify the console log indicating the MongoDB connection was closed.
    expect(consoleLogSpy).toHaveBeenCalledWith("📴 MongoDB connection closed");
    // Verify that `clearTimeout` was called. This confirms attempts to clear any pending retries.
    expect(clearTimeoutSpy).toHaveBeenCalled();

    closeSpy.mockRestore(); // Restore the `close` spy
    clearTimeoutSpy.mockRestore(); // Restore the `clearTimeout` spy
  });
});
