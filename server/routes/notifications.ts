import { Router, Request, Response } from "express";
import NotificationModel from "../models/Notification";

const router = Router();

// CREATE a new notification
router.post("/", async (req: Request, res: Response) => {
  try {
    const notification = new NotificationModel(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// READ all notifications
router.get("/", async (_req: Request, res: Response) => {
  try {
    const notifications = await NotificationModel.find();
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single notification by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE a notification by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a notification by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.findByIdAndDelete(
      req.params.id
    );
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
