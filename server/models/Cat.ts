/**
 * -----------------------------------------------------------------------------
 * Cat Schema (Mongoose)
 * -----------------------------------------------------------------------------
 * Defines the structure for Cat documents in MongoDB.
 *
 * Author: pawsitiv dev
 * Inspired by Valve Developer Documentation style.
 * -----------------------------------------------------------------------------
 *
 * This schema represents a cat profile, including its name, location, images,
 * personality tags, appearance details, and creation date. Used for storing
 * and retrieving cat data in the application.
 * -----------------------------------------------------------------------------
 */
import mongoose, { Document, Schema, Model } from "mongoose";

export interface Appearance {
  furColor: string;
  furPattern: string;
  breed: string;
  hairLength: "kurz" | "mittel" | "lang";
  chonkiness: "schlank" | "normal" | "mollig" | "übergewichtig";
}

export interface Cat extends Document {
  name: string;
  location: string;
  images: string[];
  personalityTags: string[];
  appearance: Appearance;
  createdAt: Date;
}

const AppearanceSchema = new Schema<Appearance>(
  {
    furColor: { type: String, trim: true },
    furPattern: { type: String, trim: true },
    breed: { type: String, trim: true },
    hairLength: { type: String, enum: ["kurz", "mittel", "lang"], trim: true },
    chonkiness: {
      type: String,
      enum: ["schlank", "normal", "mollig", "übergewichtig"],
      trim: true,
    },
  },
  { _id: false }
);

const CatSchema = new Schema<Cat>({
  name: { type: String, required: [true, "Cat name is required."], trim: true },
  location: {
    type: String,
    required: [true, "Cat location is required."],
    trim: true,
  },
  images: { type: [String], default: [] },
  personalityTags: { type: [String], default: [] },
  appearance: { type: AppearanceSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CatModel: Model<Cat> =
  mongoose.models.Cat || mongoose.model<Cat>("Cat", CatSchema);
export default CatModel;
