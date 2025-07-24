import { Router, Request, Response } from "express";
import UserModel from "../models/User";
import upload from "../middleware/upload";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import session from "express-session";
import bcrypt from "bcryptjs";

const router = Router();

// Extend session type to include userId
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Simple session-based authentication middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

// Route: GET /users/
router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Fehler beim Abrufen der Benutzer.");
  }
});

// Route: GET /users/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("Benutzer nicht gefunden.");
    }
    res.send(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).send("Ungültige Benutzer-ID.");
    }
    res.status(500).send("Fehler beim Abrufen des Benutzers.");
  }
});

// CREATE a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a user by ID
router.put("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a user by ID
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// LOGIN route
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  try {
    const user = (await UserModel.findOne({ email })) as any;
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = (user._id as string).toString();
    res.json({ message: "Login successful", userId: user._id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

      // Only compress images
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        const compressedPath = filePath.replace(ext, `.compressed${ext}`);
        await sharp(filePath)
          .resize({ width: 800 }) // Resize to max 800px width
          .toFormat(ext === ".png" ? "png" : "jpeg", { quality: 70 }) // Compress
          .toFile(compressedPath);
        fs.unlinkSync(filePath); // Delete original
        return res
          .status(201)
          .json({ filePath: compressedPath.replace(/^server\/?/, "/") });
      }
      // For videos or other files, just return the original
      res.status(201).json({ filePath: filePath.replace(/^server\/?/, "/") });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
