import express, { Application, Request, Response } from "express";
import routes from "./routes";
import { connectDB, setupMongoEvents, closeDB } from "./db/connection";
import path from "path";

const app: Application = express();
const port = process.env.PORT || 3669;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
