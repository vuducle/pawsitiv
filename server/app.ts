/**
 * @fileoverview Main Express.js application for the Pawsitiv Cat Adoption Platform
 * @description Handles environment-specific configurations, middleware setup, routing, and server lifecycle
 * @author Pawsitiv Development Team
 * @version 1.0.0
 */

import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes";
import { connectDB, setupPostgresEvents, closeDB } from "./db/connection";
import path from "path";
import { seedDatabase } from "./db/seed";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Application = express();
const cors = require("cors");

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const isDevelopment = NODE_ENV === "development";
const port = process.env.PORT || 3669;

/**
 * Configuration object for different environments
 */
const config = {
  production: {
    cors: {
      origin: process.env.FRONTEND_URL || "https://yourdomain.com",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    session: {
      secret: process.env.SESSION_SECRET || "pawsitiv-production-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "strict" as const,
      },
      name: "pawsitiv-session",
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    },
  },
  development: {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    session: {
      secret: "pawsitiv-dev-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax" as const,
      },
      name: "pawsitiv-session",
    },
  },
};

/**
 * Sets up environment-specific middleware and configurations
 */
function setupEnvironmentConfig(): void {
  if (isProduction) {
    console.log("🚀 Starting server in PRODUCTION mode");

    // Security middleware
    app.use(helmet(config.production.helmet));

    // Rate limiting
    app.use(rateLimit(config.production.rateLimit));

    // CORS and session
    app.use(cors(config.production.cors));
    app.use(session(config.production.session));

    // Production logging
    app.use(createProductionLogger());
  } else {
    console.log("🔧 Starting server in DEVELOPMENT mode");

    // CORS and session
    app.use(cors(config.development.cors));
    app.use(session(config.development.session));

    // Development logging
    app.use(createDevelopmentLogger());
  }
}

/**
 * Creates production logging middleware
 * @returns {Function} Express middleware function
 */
function createProductionLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`
      );
    });
    next();
  };
}

/**
 * Creates development logging middleware with detailed information
 * @returns {Function} Express middleware function
 */
function createDevelopmentLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `✅ ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
      );
    });
    next();
  };
}

/**
 * Sets up common middleware used in both environments
 */
function setupCommonMiddleware(): void {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
}

/**
 * Sets up application routes
 */
function setupRoutes(): void {
  // API routes
  app.use("/api", routes);

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  // Root endpoint with environment-specific response
  app.get("/", (_req: Request, res: Response) => {
    const baseResponse = {
      message: "Willkommen bei der Pawsitiv Backend API, Prof. Kleinen! 🐱",
      version: "1.0.0",
      description: "Eine API für die beste Katzen-Adoptionsplattform der Welt",
      team: "Entwickelt von Malte Szemlics, Sophia Kawgan Kagan, Leticia Halm und Vu Duc (Minh) Le",
      environment: NODE_ENV,
    };

    if (isDevelopment) {
      res.json({
        ...baseResponse,
        debug: {
          database: `${process.env.POSTGRES_HOST || "localhost"}:${
            process.env.POSTGRES_PORT || "5432"
          }/${process.env.POSTGRES_DB || "pawsitiv"}`,
          nodeVersion: process.version,
          platform: process.platform,
        },
      });
    } else {
      res.json(baseResponse);
    }
  });

  // Serve uploaded files statically
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

/**
 * Sets up error handling middleware
 */
function setupErrorHandling(): void {
  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ Error:", err);

    if (isDevelopment) {
      res.status(500).json({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
        message: "Something went wrong on our end. Please try again later.",
      });
    }
  });

  // 404 handler
  app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
      method: req.method,
    });
  });
}

/**
 * Sets up process event handlers for graceful shutdown
 */
function setupProcessHandlers(): void {
  // Graceful shutdown handlers
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
    try {
      await closeDB();
      console.log("✅ Database connection closed");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });
}

/**
 * Initializes the database connection and starts the server
 */
async function initializeServer(): Promise<void> {
  try {
    console.log("🔌 Connecting to PostgreSQL...");
    await connectDB();
    setupPostgresEvents();

    // Seed database in development mode
    if (isDevelopment && process.env.SEED_DATABASE === "true") {
      console.log("🌱 Seeding database...");
      await seedDatabase();
    }

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);

      if (isDevelopment) {
        console.log(
          `🔗 PostgreSQL URI: ${process.env.POSTGRES_HOST || "localhost"}:${
            process.env.POSTGRES_PORT || "5432"
          }/${process.env.POSTGRES_DB || "pawsitiv"}`
        );
        console.log(`📝 API Documentation: http://localhost:${port}/api`);
        console.log(`🔧 Development mode enabled`);
      } else {
        console.log(`🛡️ Production mode enabled`);
        console.log(`🔒 Security features active`);
      }
    });
  } catch (error) {
    console.error("💥 Critical startup failure:", error);
    process.exit(1);
  }
}

// Initialize the application
setupEnvironmentConfig();
setupCommonMiddleware();
setupRoutes();
setupErrorHandling();
setupProcessHandlers();
initializeServer();
