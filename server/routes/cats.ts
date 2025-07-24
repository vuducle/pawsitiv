import { Router, Request, Response } from "express";
import CatModel from "../models/Cat";

const router = Router();

// CREATE a new cat
router.post("/", async (req: Request, res: Response) => {
  try {
    const cat = new CatModel(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// READ all cats
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cats = await CatModel.find();
    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single cat by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cat = await CatModel.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: "Cat not found" });
    res.json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a cat by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const cat = await CatModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cat) return res.status(404).json({ error: "Cat not found" });
    res.json(cat);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a cat by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const cat = await CatModel.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: "Cat not found" });
    res.json({ message: "Cat deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
