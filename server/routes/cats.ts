import { Router, Request, Response } from "express";
import { CatModel } from "../models/Cat";
import upload from "../middleware/upload";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import session from "express-session";
import { configurationStorage } from "../multerConfig";
import { CatImageModel } from "../models/CatImage";
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

const multer = configurationStorage();
router.post(
  "/upload",
  multer.single("picture"),
  async (req: Request, res: Response) => {
    try {
      const { catId } = req.body;
      if (!catId) {
        return res.status(400).json({ error: "catId is required" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageBuffer = fs.readFileSync(req.file.path);
      await CatImageModel.create({ catId: Number(catId), data: imageBuffer });
      fs.unlinkSync(req.file.path);

      res.status(201).json({ message: "Image uploaded successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
