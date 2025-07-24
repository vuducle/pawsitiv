import { Router, Request, Response } from "express";
import UserModel from "../models/User";

const router = Router();

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
router.put("/:id", async (req: Request, res: Response) => {
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
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
