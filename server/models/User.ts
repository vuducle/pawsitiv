import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  profilePicture: string;
  subscribedCats: mongoose.Types.ObjectId[];
  createdAt: Date;
  isAdmin: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: [true, "Name is required."], trim: true },
  username: {
    type: String,
    required: [true, "username is required."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Passwort is required."],
    minlength: [6, "Password must be at least 6 characters"],
  },
  email: {
    type: String,
    required: [true, "E-Mail ist erforderlich."],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Pls give a valid email address."],
  },
  profilePicture: { type: String, default: "/twice-stan.jpg" },
  subscribedCats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cat" }],
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default UserModel;
