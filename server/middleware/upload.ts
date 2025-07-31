import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Set up storage engine for multer
const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // Save user uploads in /uploads/profile, cat uploads in /uploads/cats
    if (req.baseUrl.includes("users")) {
      cb(null, path.join(__dirname, "../uploads/profile"));
    } else if (req.baseUrl.includes("cats")) {
      cb(null, path.join(__dirname, "../uploads/cats"));
    } else {
      cb(null, path.join(__dirname, "../uploads/other"));
    }
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    // Use original name with timestamp for uniqueness
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

// Multer instance for handling uploads (max 10MB, images/videos only)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"));
    }
  },
});

export default upload;
