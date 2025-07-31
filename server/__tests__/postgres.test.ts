import UserModel from "../models/User";
import CatModel from "../models/Cat";
import NotificationModel from "../models/Notification";

describe("PostgreSQL Models", () => {
  describe("UserModel", () => {
    it("should create a user", async () => {
      const userData = {
        name: "Test User",
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        profilePicture: "/test.jpg",
        isAdmin: false,
      };

      const user = await UserModel.create(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.id).toBeDefined();
    });

    it("should find user by email", async () => {
      const userData = {
        name: "Test User 2",
        username: "testuser2",
        password: "password123",
        email: "test2@example.com",
        profilePicture: "/test2.jpg",
        isAdmin: false,
      };

      await UserModel.create(userData);
      const foundUser = await UserModel.findByEmail("test2@example.com");

      expect(foundUser).toBeDefined();
      expect(foundUser!.email).toBe("test2@example.com");
    });
  });

  describe("CatModel", () => {
    it("should create a cat", async () => {
      const catData = {
        name: "Test Cat",
        location: "Test Location",
        images: ["/cat1.jpg"],
        personalityTags: ["friendly", "playful"],
        appearance: {
          furColor: "Orange",
          furPattern: "Tabby",
          breed: "Domestic Shorthair",
          hairLength: "kurz" as const,
          chonkiness: "normal" as const,
        },
      };

      const cat = await CatModel.create(catData);

      expect(cat).toBeDefined();
      expect(cat.name).toBe(catData.name);
      expect(cat.location).toBe(catData.location);
      expect(cat.id).toBeDefined();
    });
  });

  describe("NotificationModel", () => {
    it("should create a notification", async () => {
      // First create a user and cat
      const user = await UserModel.create({
        name: "Test User",
        username: "testuser3",
        password: "password123",
        email: "test3@example.com",
        profilePicture: "/test3.jpg",
        isAdmin: false,
      });

      const cat = await CatModel.create({
        name: "Test Cat 2",
        location: "Test Location 2",
        images: ["/cat2.jpg"],
        personalityTags: ["shy"],
        appearance: {
          furColor: "Black",
          furPattern: "Solid",
          breed: "Domestic Longhair",
          hairLength: "lang" as const,
          chonkiness: "schlank" as const,
        },
      });

      const notificationData = {
        userId: user.id!,
        catId: cat.id!,
        type: "neue_katze" as const,
        seen: false,
      };

      const notification = await NotificationModel.create(notificationData);

      expect(notification).toBeDefined();
      expect(notification.userId).toBe(user.id);
      expect(notification.catId).toBe(cat.id);
      expect(notification.type).toBe("neue_katze");
      expect(notification.id).toBeDefined();
    });
  });
});
