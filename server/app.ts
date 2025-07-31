import express, { Application, Request, Response } from "express";
import routes from "./routes";
import { connectDB, setupMongoEvents, closeDB } from "./db/connection";
import path from "path";
import { seedDatabase } from "./db/seed";
import session from "express-session";
const app: Application = express();
const cors = require("cors");
const port = process.env.PORT || 3669;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow only your frontend origins
    credentials: true, // Allow sending of cookies, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  session({
    secret: "pawsitiv-secret-key", // Change this secret for production
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevents client-side access to the cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax", // Allows cross-site requests
    },
    name: "pawsitiv-session", // Custom session name
  })
);
app.use("/api", routes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Willkommen bei der Pawsitiv Backend API, Prof. Kleinen! 🐱",
    version: "1.0.0",
    description: "Eine API für die beste Katzen-Adoptionsplattform der Welt",
    team: "Entwickelt von Malte Szemlics, Sophia Kawgan Kagan, Leticia Halm und Vu Duc (Minh) Le",
  });
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

(async () => {
  try {
    await connectDB();
    setupMongoEvents();
  } catch (error) {
    console.error("💥 Critical DB connection failure:", error);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  try {
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(
    `🔗 MongoDB URI: ${
      process.env.MONGODB_URI ||
      "mongodb://admin:pawsitiv123@localhost:27017/pawsitiv?authSource=admin"
    }`
  );
});
