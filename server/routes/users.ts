import { Router, Request, Response } from "express";
import { UserModel } from "../models/User";
import upload from "../middleware/upload";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import session from "express-session";
const bcrypt = require("bcryptjs");

const router = Router();

// Extend session type to include userId
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Environment configuration
const SALT_ROUNDS = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUsername = (
  username: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 20) {
    errors.push("Username must be less than 20 characters");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

// Error handling middleware
const handleError = (
  error: any,
  res: Response,
  defaultMessage: string = "Internal server error"
) => {
  console.error("Error:", error);

  if (error.code === "23505") {
    // PostgreSQL unique constraint violation
    const field = error.detail?.includes("email") ? "email" : "username";
    return res.status(400).json({ error: `${field} already exists` });
  }

  if (error.code === "22P02") {
    // PostgreSQL invalid text representation
    return res.status(400).json({ error: "Invalid ID format" });
  }

  res.status(500).json({ error: defaultMessage });
};

// ===== USER CRUD OPERATIONS =====

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.getAll();
    // Remove passwords from response
    const usersWithoutPasswords = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    handleError(error, res, "Failed to fetch users");
  }
});

// GET current user (me) - MUST come before /:id route
router.get("/me", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.session.userId!);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    handleError(error, res, "Failed to fetch current user");
  }
});

// GET user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    handleError(error, res, "Failed to fetch user");
  }
});

// CREATE new user (register)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.errors[0] });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ error: usernameValidation.errors[0] });
    }

    // Check if user already exists
    const existingUserByEmail = await UserModel.findByEmail(email);
    const existingUserByUsername = await UserModel.findByUsername(username);

    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Create new user
    const user = await UserModel.create({
      name,
      username,
      email,
      password,
      profilePicture: "/twice-stan.jpg",
      isAdmin: false,
    });

    // Set session
    req.session.userId = user.id!.toString();

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      message: "Registration successful",
    });
  } catch (error) {
    handleError(error, res, "Registration failed");
  }
});

// CREATE new user (admin route)
router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    handleError(error, res, "Failed to create user");
  }
});

// UPDATE user by ID
router.put("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { name, username, email, profilePicture } = req.body;
    const updateData: any = {};

    // Only allow updating specific fields
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (email) {
      if (!validateEmail(email)) {
        return res
          .status(400)
          .json({ error: "Please enter a valid email address" });
      }
      updateData.email = email;
    }
    if (profilePicture) updateData.profilePicture = profilePicture;

    const userId = parseInt(req.params.id);
    const user = await UserModel.update(userId, updateData);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    handleError(error, res, "Failed to update user");
  }
});

// DELETE user by ID
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await UserModel.delete(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(error, res, "Failed to delete user");
  }
});

// ===== AUTHENTICATION ROUTES =====

// LOGIN route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await UserModel.matchPassword(user, password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user.id!.toString();

    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Session creation failed" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        message: "Login successful",
      });
    });
  } catch (error) {
    handleError(error, res, "Login failed");
  }
});

// LOGOUT route
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

// ===== FILE UPLOAD ROUTES =====

// Upload user profile image/video
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const ext = path.extname(filePath).toLowerCase();

      // Check file size
      if (req.file.size > MAX_FILE_SIZE) {
        fs.unlinkSync(filePath); // Delete uploaded file
        return res.status(400).json({ error: "File size too large (max 5MB)" });
      }

      // Only compress images
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        const compressedPath = filePath.replace(ext, `.compressed${ext}`);

        await sharp(filePath)
          .resize({ width: 800 }) // Resize to max 800px width
          .toFormat(ext === ".png" ? "png" : "jpeg", { quality: 70 }) // Compress
          .toFile(compressedPath);

        fs.unlinkSync(filePath); // Delete original

        return res.status(201).json({
          filePath: compressedPath.replace(/^server\/?/, "/"),
        });
      }

      // For videos or other files, just return the original
      res.status(201).json({
        filePath: filePath.replace(/^server\/?/, "/"),
      });
    } catch (error) {
      handleError(error, res, "File upload failed");
    }
  }
);

export default router;
