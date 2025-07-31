import { Router, Request, Response } from "express";
import { CatModel } from "../models/Cat";
import upload from "../middleware/upload";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import session from "express-session";

// Extend session type to include userId
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const router = Router();

// Simple session-based authentication middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

// CREATE a new cat
router.post("/", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const cat = await CatModel.create(req.body);
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// READ all cats
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cats = await CatModel.getAll();
    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single cat by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const catId = parseInt(req.params.id);
    const cat = await CatModel.findById(catId);
    if (!cat) return res.status(404).json({ error: "Cat not found" });
    res.json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a cat by ID
router.put("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const catId = parseInt(req.params.id);
    const cat = await CatModel.update(catId, req.body);
    if (!cat) return res.status(404).json({ error: "Cat not found" });
    res.json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a cat by ID
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const catId = parseInt(req.params.id);
    const deleted = await CatModel.delete(catId);
    if (!deleted) return res.status(404).json({ error: "Cat not found" });
    res.json({ message: "Cat deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Upload cat image/video
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
