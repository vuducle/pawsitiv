import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: (
    _: Request,
    __: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, "uploads");
  },
  filename: (
    _: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    callback(null, `${uuid()}.${extension}`);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/))
    return callback(new Error("Only image files are allowed"));
  callback(null, true);
};

export const configurationStorage = () => multer({ storage, fileFilter });
