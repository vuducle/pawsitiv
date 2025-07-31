import "dotenv/config";
import { connectDB, closeDB } from "./connection";
import { UserModel } from "../models/User";
import { CatModel } from "../models/Cat";
import { NotificationModel } from "../models/Notification";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🗑️ Deleting existing data...");
    // Clear all tables
    const client = await (await import("./connection")).getClient();
    await client.query("DELETE FROM notifications");
    await client.query("DELETE FROM user_cat_subscriptions");
    await client.query("DELETE FROM cats");
    await client.query("DELETE FROM users");
    client.release();
    console.log("✅ Existing data deleted.");

    // --- User data ---
    console.log("✨ Creating new users...");
    const usersData = [
      {
        name: "Cloud Strife",
        username: "cloudstrife",
        password: "cloudstrife",
        email: "cloud.strife@example.com",
        profilePicture: "/upload/profile/cloudstrife.jpg",
        isAdmin: false,
      },
      {
        name: "Tifa Lockhart",
        username: "tifalockhart",
        password: "tifalockhart",
        email: "tifa.lockhart@example.com",
        profilePicture: "/upload/profile/tifalockhart.jpg",
        isAdmin: false,
      },
      {
        name: "Malte Szemlics",
        username: "malteszemlics",
        password: "malteszemlics",
        email: "malte.szemlics@example.com",
        profilePicture: "/upload/profile/malteszemlics.jpg",
        isAdmin: true,
      },
      {
        name: "Leticia Halm",
        username: "leticiahalm",
        password: "leticiahalm",
        email: "leticia.halm@example.com",
        profilePicture: "/upload/profile/leticiahalm.jpg",
        isAdmin: false,
      },
      {
        name: "Sophia Kawgan Kagan",
        username: "sophiakawgankagan",
        password: "sophiakawgankagan",
        email: "sophia.kawgankagan@example.com",
        profilePicture: "/upload/profile/sophiakawgankagan.jpg",
        isAdmin: false,
      },
      {
        name: "Vu Duc Le",
        username: "vuducle",
        password: "vuducle",
        email: "vuducle@example.com",
        profilePicture: "/upload/profile/vuducle.jpg",
        isAdmin: false,
      },
      {
        name: "Winston Reichelt",
        username: "winstonreichelt",
        password: "winstonreichelt",
        email: "winston.reichelt@example.com",
        profilePicture: "/upload/profile/winstonreichelt.jpg",
        isAdmin: false,
      },
      {
        name: "Homam Mousa",
        username: "homammousa",
        password: "homammousa",
        email: "homam.mousa@example.com",
        profilePicture: "/upload/profile/homammousa.jpg",
        isAdmin: false,
      },
      {
        name: "Triesnha Ameilya",
        username: "triesnhaameilya",
        password: "triesnhaameilya",
        email: "triesnha.ameilya@example.com",
        profilePicture: "/upload/profile/triesnhaameilya.jpg",
        isAdmin: false,
      },
      {
        name: "Armin Dorri",
        username: "armindorri",
        password: "armindorri",
        email: "armin.dorri@example.com",
        profilePicture: "/upload/profile/armindorri.jpg",
        isAdmin: false,
      },
      {
        name: "Vu Minh Le ",
        username: "vuminhle",
        password: "vuminhle",
        email: "vuminhle@example.com",
        profilePicture: "/upload/profile/vuminhle.jpg",
        isAdmin: false,
      },
      {
        name: "Linh Chi Nguyen",
        username: "linhchinguyen",
        password: "linhchinguyen",
        email: "linhchi.nguyen@example.com",
        profilePicture: "/upload/profile/linhchinguyen.jpg",
        isAdmin: false,
      },
      {
        name: "Cong Nguyen Dinh",
        username: "congnguyendinh",
        password: "congnguyendinh",
        email: "cong.nguyen.dinh@example.com",
        profilePicture: "/upload/profile/congnguyendinh.jpg",
        isAdmin: false,
      },
    ];

    const createdUsers: any[] = [];
    for (const userData of usersData) {
      const user = await UserModel.create(userData);
      createdUsers.push(user);
    }
    console.log("✅ Users created successfully!");
    console.log(
      createdUsers.map((user) => ({
        username: user.username,
        email: user.email,
      }))
    );

    // --- Cat data ---
    console.log("✨ Creating new cat profiles...");
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
          hairLength: "lang" as const,
          chonkiness: "normal" as const,
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
          hairLength: "lang" as const,
          chonkiness: "mollig" as const,
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
          hairLength: "kurz" as const,
          chonkiness: "schlank" as const,
        },
      },
      // The 3 special cats
      {
        name: "Barrett",
        location: "Sector 7 Slums",
        images: ["/upload/cats/barrett_1.jpg", "/upload/cats/barrett_2.jpg"],
        personalityTags: ["beschützend", "laut", "loyal"],
        appearance: {
          furColor: "Schwarz",
          furPattern: "Einfarbig",
          breed: "Bombay",
          hairLength: "kurz" as const,
          chonkiness: "mollig" as const,
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
          hairLength: "kurz" as const,
          chonkiness: "schlank" as const,
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
          hairLength: "kurz" as const,
          chonkiness: "normal" as const,
        },
      },
      {
        name: "Chonkus Maximus",
        location: "Chania, Kreta",
        images: ["/upload/cats/chonkus_1.jpg", "/upload/cats/chonkus_2.jpg"],
        personalityTags: ["verspielt", "neugierig", "sanft"],
        appearance: {
          furColor: "Schwarz",
          furPattern: "Einfarbig",
          breed: "Perser",
          hairLength: "lang" as const,
          chonkiness: "mollig" as const,
        },
      },
    ];

    const createdCats: any[] = [];
    for (const catData of catsData) {
      const cat = await CatModel.create(catData);
      createdCats.push(cat);
    }
    console.log("✅ Cat profiles created successfully!");
    console.log(
      createdCats.map((cat) => ({ name: cat.name, location: cat.location }))
    );

    // --- Notification data ---
    console.log("✨ Creating new notifications...");
    const cloud = createdUsers.find((u) => u.username === "cloudstrife");
    const tifa = createdUsers.find((u) => u.username === "tifalockhart");
    const malte = createdUsers.find((u) => u.username === "malteszemlics");
    const barrettCat = createdCats.find((c) => c.name === "Barrett");
    const yunaCat = createdCats.find((c) => c.name === "Yuna");
    const leonCat = createdCats.find((c) => c.name === "Leon S. Kennedy");

    const notificationsData = [
      {
        userId: cloud.id,
        catId: barrettCat.id,
        type: "neue_katze" as const,
        seen: false,
      },
      {
        userId: tifa.id,
        catId: yunaCat.id,
        type: "update_katze" as const,
        seen: true,
      },
      {
        userId: malte.id,
        catId: leonCat.id,
        type: "match" as const,
        seen: false,
      },
    ];

    const createdNotifications: any[] = [];
    for (const notificationData of notificationsData) {
      const notification = await NotificationModel.create(notificationData);
      createdNotifications.push(notification);
    }

    console.log("✅ Notifications created successfully!");
    console.log(
      createdNotifications.map((n) => ({
        userId: n.userId,
        type: n.type,
        seen: n.seen,
      }))
    );
    console.log("\n--- Seeding completed! ---");
  } catch (error: any) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  } finally {
    await closeDB();
    console.log("PostgreSQL connection closed.");
  }
};

const main = async () => {
  try {
    await connectDB();
    console.log("PostgreSQL connected for seeding...");
    await seedDatabase();
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
