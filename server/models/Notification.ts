import mongoose, { Document, Schema, Model } from "mongoose";

export interface Notification extends Document {
  user: mongoose.Types.ObjectId;
  cat: mongoose.Types.ObjectId;
  type: "neue_katze" | "update_katze" | "match" | "nachricht";
  timestamp: Date;
  seen: boolean;
}

const NotificationSchema = new Schema<Notification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [
      true,
      "Eine Benachrichtigung muss einem Benutzer zugeordnet sein.",
    ],
  },
  cat: {
    type: Schema.Types.ObjectId,
    ref: "Cat",
    required: [true, "Eine Benachrichtigung muss einer Katze zugeordnet sein."],
  },
  type: {
    type: String,
    required: [true, "Der Typ der Benachrichtigung ist erforderlich."],
    enum: ["neue_katze", "update_katze", "match", "nachricht"],
    trim: true,
  },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

const NotificationModel: Model<Notification> =
  mongoose.models.Notification ||
  mongoose.model<Notification>("Notification", NotificationSchema);
export default NotificationModel;
