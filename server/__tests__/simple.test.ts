import mongoose from "mongoose";
const Cat = require("../models/Cat");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/jest";

describe("Cat Model Integration Test (with real MongoDB)", () => {
  beforeAll(async () => {
    if (!MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set");
    }
    await mongoose.connect(MONGO_URL, {
      dbName: "jest",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Cat.deleteMany({});
  });

  it("should create and save a cat successfully", async () => {
    const catData = {
      name: "Cloud Strife",
      location: "Midgar",
      images: ["/upload/cats/cloud_strife_1.jpg"],
      personalityTags: ["playful", "curious"],
      appearance: {
        furColor: "gray",
        furPattern: "striped",
        breed: "Tabby",
        hairLength: "mittel",
        chonkiness: "normal",
      },
    };
    const cat = new Cat(catData);
    const savedCat = await cat.save();

    expect(savedCat._id).toBeDefined();
    expect(savedCat.name).toBe(catData.name);
    expect(savedCat.location).toBe(catData.location);
    expect(savedCat.images[0]).toBe(catData.images[0]);
    expect(savedCat.personalityTags).toEqual(catData.personalityTags);
    expect(savedCat.appearance.furColor).toBe(catData.appearance.furColor);
    expect(savedCat.appearance.breed).toBe(catData.appearance.breed);
  });
});
