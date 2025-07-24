import "dotenv/config";
import mongoose from "mongoose";
import UserModel from "../models/User";
import CatModel from "../models/Cat";
import NotificationModel from "../models/Notification";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🗑️ Lösche bestehende Daten...");
    await UserModel.deleteMany({});
    await CatModel.deleteMany({});
    await NotificationModel.deleteMany({});
    console.log("✅ Bestehende Daten gelöscht.");

    // --- Benutzerdaten ---
    console.log("✨ Erstelle neue Benutzer...");
    const usersData = [
      {
        name: "Cloud Strife",
        username: "cloudstrife",
        password: "cloudstrife",
        email: "cloud.strife@example.com",
        profilePicture: "/upload/profile/cloudstrife.jpg",
      },
      {
        name: "Tifa Lockhart",
        username: "tifalockhart",
        password: "tifalockhart",
        email: "tifa.lockhart@example.com",
        profilePicture: "/upload/profile/tifalockhart.jpg",
      },
      {
        name: "Malte Szemlics",
        username: "malteszemlics",
        password: "malteszemlics",
        email: "malte.szemlics@example.com",
        profilePicture: "/upload/profile/malteszemlics.jpg",
      },
      {
        name: "Leticia Halm",
        username: "leticiahalm",
        password: "leticiahalm",
        email: "leticia.halm@example.com",
        profilePicture: "/upload/profile/leticiahalm.jpg",
      },
      {
        name: "Sophia Kawgan Kagan",
        username: "sophiakawgankagan",
        password: "sophiakawgankagan",
        email: "sophia.kawgankagan@example.com",
        profilePicture: "/upload/profile/sophiakawgankagan.jpg",
      },
      {
        name: "Vu Duc Le",
        username: "vuducle",
        password: "vuducle",
        email: "vuducle@example.com",
        profilePicture: "/upload/profile/vuducle.jpg",
      },
      {
        name: "Winston Reichelt",
        username: "winstonreichelt",
        password: "winstonreichelt",
        email: "winston.reichelt@example.com",
        profilePicture: "/upload/profile/winstonreichelt.jpg",
      },
      {
        name: "Homam Mousa",
        username: "homammousa",
        password: "homammousa",
        email: "homam.mousa@example.com",
        profilePicture: "/upload/profile/homammousa.jpg",
      },
      {
        name: "Triesnha Ameilya",
        username: "triesnhaameilya",
        password: "triesnhaameilya",
        email: "triesnha.ameilya@example.com",
        profilePicture: "/upload/profile/triesnhaameilya.jpg",
      },
      {
        name: "Armin Dorri",
        username: "armindorri",
        password: "armindorri",
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

    // --- Katzendaten ---
    console.log("✨ Erstelle neue Katzenprofile...");
    const catsData = [
      {
        name: "Princess Purrsalot",
        location: "Midgar",
        images: [
          "/upload/cats/princess_purrsalot_1.jpg",
          "/upload/cats/princess_purrsalot_2.jpg",
        ],
        personalityTags: ["verspielt", "neugierig", "sanft"],
        appearance: {
          furColor: "Weiß",
          furPattern: "Einfarbig",
          breed: "Perser",
          hairLength: "lang",
          chonkiness: "normal",
        },
      },
      {
        name: "Commander Meowington",
        location: "Kalm",
        images: ["/upload/cats/commander_meowington_1.jpg"],
        personalityTags: ["abenteuerlustig", "mutig"],
        appearance: {
          furColor: "Schwarz",
          furPattern: "Gestreift",
          breed: "Maine Coon",
          hairLength: "lang",
          chonkiness: "mollig",
        },
      },
      {
        name: "Sir Snugglepuss",
        location: "Cosmo Canyon",
        images: [
          "/upload/cats/sir_snugglepuss_1.jpg",
          "/upload/cats/sir_snugglepuss_2.jpg",
          "/upload/cats/sir_snugglepuss_3.jpg",
        ],
        personalityTags: ["verschmust", "ruhig", "faul"],
        appearance: {
          furColor: "Orange",
          furPattern: "Getigert",
          breed: "Europäisch Kurzhaar",
          hairLength: "kurz",
          chonkiness: "schlank",
        },
      },
      // Die 3 speziellen Katzen
      {
        name: "Barrett",
        location: "Sector 7 Slums",
        images: ["/upload/cats/barrett_1.jpg", "/upload/cats/barrett_2.jpg"],
        personalityTags: ["beschützend", "laut", "loyal"],
        appearance: {
          furColor: "Schwarz",
          furPattern: "Einfarbig",
          breed: "Bombay",
          hairLength: "kurz",
          chonkiness: "mollig",
        },
      },
      {
        name: "Yuna",
        location: "Besaid Island",
        images: ["/upload/cats/yuna_1.jpg"],
        personalityTags: ["sanft", "spirituell", "mutig"],
        appearance: {
          furColor: "Weiß",
          furPattern: "Siam",
          breed: "Siamese",
          hairLength: "kurz",
          chonkiness: "schlank",
        },
      },
      {
        name: "Leon S. Kennedy",
        location: "Raccoon City",
        images: ["/upload/cats/leon_1.jpg", "/upload/cats/leon_2.jpg"],
        personalityTags: ["beobachtend", "cool", "überlebenskünstler"],
        appearance: {
          furColor: "Braun",
          furPattern: "Getigert",
          breed: "Abessinier",
          hairLength: "kurz",
          chonkiness: "normal",
        },
      },
    ];
    const createdCats = await CatModel.insertMany(catsData);
    console.log("✅ Katzenprofile erfolgreich erstellt!");
    console.log(
      createdCats.map((cat) => ({ name: cat.name, location: cat.location }))
    );

    // --- Benachrichtigungsdaten ---
    console.log("✨ Erstelle neue Benachrichtigungen...");
    const cloud = createdUsers.find((u) => u.username === "cloudstrife");
    const tifa = createdUsers.find((u) => u.username === "tifalockhart");
    const malte = createdUsers.find((u) => u.username === "malteszemlics");
    const barrettCat: any = createdCats.find((c: any) => c.name === "Barrett");
    const yunaCat: any = createdCats.find((c: any) => c.name === "Yuna");
    const leonCat: any = createdCats.find(
      (c: any) => c.name === "Leon S. Kennedy"
    );
    const notificationsData = [
      {
        user: cloud._id,
        cat: barrettCat._id,
        type: "neue_katze",
        timestamp: new Date(Date.now() - 86400000),
        seen: false,
      },
      {
        user: tifa._id,
        cat: yunaCat._id,
        type: "update_katze",
        timestamp: new Date(Date.now() - 3600000),
        seen: true,
      },
      {
        user: malte._id,
        cat: leonCat._id,
        type: "match",
        timestamp: new Date(),
        seen: false,
      },
    ];
    const createdNotifications = await NotificationModel.insertMany(
      notificationsData
    );
    console.log("✅ Benachrichtigungen erfolgreich erstellt!");
    console.log(
      createdNotifications.map((n: any) => ({
        user: n.user,
        type: n.type,
        seen: n.seen,
      }))
    );
    console.log("\n--- Seeding abgeschlossen! ---");
  } catch (error: any) {
    console.error("❌ Fehler beim Seeden der Datenbank:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB Verbindung geschlossen.");
  }
};

const DB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/cat_adoption_db";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("MongoDB verbunden für Seeding...");
    seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB Verbindungsfehler:", err);
    process.exit(1);
  });
