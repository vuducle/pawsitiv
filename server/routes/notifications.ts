import { Router, Request, Response } from "express";
import { NotificationModel } from "../models/Notification";

const router = Router();

// CREATE a new notification
router.post("/", async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// READ all notifications
router.get("/", async (_req: Request, res: Response) => {
  try {
    const notifications = await NotificationModel.getAll();
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single notification by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const notificationId = parseInt(req.params.id);
    const notification = await NotificationModel.findById(notificationId);
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
    const notificationId = parseInt(req.params.id);
    const notification = await NotificationModel.markAsSeen(notificationId);
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
    const notificationId = parseInt(req.params.id);
    const deleted = await NotificationModel.delete(notificationId);
    if (!deleted)
      return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
