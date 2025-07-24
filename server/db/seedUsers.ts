import "dotenv/config";
import mongoose from "mongoose";
import UserModel from "../models/User";

export const seedUsers = async (): Promise<void> => {
  try {
    console.log("🗑️ Lösche bestehende Benutzer...");
    await UserModel.deleteMany({});
    console.log("✨ Erstelle neue Benutzer...");
    const usersData = [
      {
        name: "Cloud Strife",
        username: "cloudstrife",
        password: "cloudstrife", // Dieses Passwort wird gehasht
        email: "cloud.strife@example.com",
        profilePicture: "/upload/profile/cloudstrife.jpg",
      },
      {
        name: "Tifa Lockhart",
        username: "tifalockhart",
        password: "tifalockhart", // Auch dieses wird gehasht
        email: "tifa.lockhart@example.com",
        profilePicture: "/upload/profile/tifalockhart.jpg",
      },
      {
        name: "Malte Szemlics",
        username: "malteszemlics",
        password: "malteszemlics", // Auch dieses wird gehasht
        email: "malte.szemlics@example.com",
        profilePicture: "/upload/profile/malteszemlics.jpg",
      },
      {
        name: "Leticia Halm",
        username: "leticiahalm",
        password: "leticiahalm", // Auch dieses wird gehasht
        email: "leticia.halm@example.com",
        profilePicture: "/upload/profile/leticiahalm.jpg",
      },
      {
        name: "Sophia Kawgan Kagan",
        username: "sophiakawgankagan",
        password: "sophiakawgankagan", // Auch dieses wird gehasht
        email: "sophia.kawgankagan@example.com",
        profilePicture: "/upload/profile/sophiakawgankagan.jpg",
      },
      {
        name: "Vu Duc Le",
        username: "vuducle",
        password: "vuducle", // Auch dieses wird gehasht
        email: "vuducle@example.com",
        profilePicture: "/upload/profile/vuducle.jpg",
      },
      {
        name: "Winston Reichelt",
        username: "winstonreichelt",
        password: "winstonreichelt", // Auch dieses wird gehasht
        email: "winston.reichelt@example.com",
        profilePicture: "/upload/profile/winstonreichelt.jpg",
      },
      {
        name: "Homam Mousa",
        username: "homammousa",
        password: "homammousa", // Auch dieses wird gehasht
        email: "homam.mousa@example.com",
        profilePicture: "/upload/profile/homammousa.jpg",
      },
      {
        name: "Triesnha Ameilya",
        username: "triesnhaameilya",
        password: "triesnhaameilya", // Auch dieses wird gehasht
        email: "triesnha.ameilya@example.com",
        profilePicture: "/upload/profile/triesnhaameilya.jpg",
      },
      {
        name: "Armin Dorri",
        username: "armindorri",
        password: "armindorri", // Auch dieses wird gehasht
        email: "armin.dorri@example.com",
        profilePicture: "/upload/profile/armindorri.jpg",
      },
    ];
    const createdUsers: any[] = [];
    for (const userData of usersData) {
      const user = new UserModel(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log("✅ Benutzer erfolgreich erstellt!");
    console.log(
      createdUsers.map((user) => ({
        username: user.username,
        email: user.email,
      }))
    );
  } catch (error: any) {
    console.error("❌ Fehler beim Seeden der Benutzer:", error.message);
  }
};
