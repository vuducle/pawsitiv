/**
 * @jest-environment node
 */

import mongoose from "mongoose";
import { connectDB, closeDB } from "../db/connection";
import Cat from "../models/Cat";

/**
 * Test suite for Cat model database operations.
 *
 * This test suite validates the Cat schema, CRUD operations, and data validation.
 * It includes tests for creating cats with various attributes and edge cases.
 *
 * @author Pawsitiv Team
 * @version 1.0.0
 */
describe("Cat Model Tests", () => {
  /**
   * Test data for creating cats with different characteristics.
   * Each cat represents a different personality and appearance type.
   */
  const testCats = {
    /**
     * Tifa - A gentle, caring cat with medium hair and normal build.
     * Represents a balanced personality with nurturing traits.
     */
    tifa: {
      name: "Tifa",
      location: "Midgar, Sector 7",
      images: [
        "https://example.com/tifa1.jpg",
        "https://example.com/tifa2.jpg",
      ],
      personalityTags: ["gentle", "caring", "protective", "loyal"],
      appearance: {
        furColor: "orange",
        furPattern: "tabby",
        breed: "Domestic Shorthair",
        hairLength: "mittel",
        chonkiness: "normal",
      },
    },

    /**
     * Cloud - A mysterious, independent cat with short hair and slim build.
     * Represents a solitary personality with strong independence.
     */
    cloud: {
      name: "Cloud",
      location: "Nibelheim",
      images: ["https://example.com/cloud1.jpg"],
      personalityTags: ["independent", "mysterious", "reserved", "strong"],
      appearance: {
        furColor: "silver",
        furPattern: "solid",
        breed: "Russian Blue",
        hairLength: "kurz",
        chonkiness: "schlank",
      },
    },

    /**
     * Barret - A bold, energetic cat with long hair and robust build.
     * Represents an outgoing personality with leadership traits.
     */
    barret: {
      name: "Barret",
      location: "Corel",
      images: [
        "https://example.com/barret1.jpg",
        "https://example.com/barret2.jpg",
        "https://example.com/barret3.jpg",
      ],
      personalityTags: ["bold", "energetic", "protective", "leader"],
      appearance: {
        furColor: "black",
        furPattern: "solid",
        breed: "Maine Coon",
        hairLength: "lang",
        chonkiness: "mollig",
      },
    },
  };

  /**
   * Setup function that runs before each test.
   * Establishes database connection and cleans up any existing data.
   */
  beforeEach(async () => {
    // Connect to test database
    await connectDB();

    // Clear all cats from the database before each test
    await Cat.deleteMany({});
  });

  /**
   * Cleanup function that runs after each test.
   * Closes database connection and cleans up resources.
   */
  afterEach(async () => {
    // Clear all cats from the database after each test
    await Cat.deleteMany({});

    // Close database connection
    await closeDB();
  });

  /**
   * Test: Create a cat with all required fields.
   *
   * Validates that a cat can be created with name and location,
   * and that optional fields are properly handled.
   */
  describe("Cat Creation", () => {
    test("should create a cat with all required fields", async () => {
      const catData = testCats.tifa;
      const cat = new Cat(catData);
      const savedCat = await cat.save();

      // Verify the cat was saved with correct data
      expect(savedCat._id).toBeDefined();
      expect(savedCat.name).toBe(catData.name);
      expect(savedCat.location).toBe(catData.location);
      expect(savedCat.images).toEqual(catData.images);
      expect(savedCat.personalityTags).toEqual(catData.personalityTags);
      expect(savedCat.appearance).toEqual(catData.appearance);
      expect(savedCat.createdAt).toBeInstanceOf(Date);
    });

    test("should create a cat with minimal required fields", async () => {
      const minimalCatData = {
        name: "Minimal Cat",
        location: "Test Location",
      };

      const cat = new Cat(minimalCatData);
      const savedCat = await cat.save();

      // Verify the cat was saved with minimal data
      expect(savedCat._id).toBeDefined();
      expect(savedCat.name).toBe(minimalCatData.name);
      expect(savedCat.location).toBe(minimalCatData.location);
      expect(savedCat.images).toEqual([]);
      expect(savedCat.personalityTags).toEqual([]);
      expect(savedCat.appearance).toEqual({});
      expect(savedCat.createdAt).toBeInstanceOf(Date);
    });

    test("should create multiple cats with different characteristics", async () => {
      // Create all three test cats
      const tifa = new Cat(testCats.tifa);
      const cloud = new Cat(testCats.cloud);
      const barret = new Cat(testCats.barret);

      const savedTifa = await tifa.save();
      const savedCloud = await cloud.save();
      const savedBarret = await barret.save();

      // Verify each cat has unique characteristics
      expect(savedTifa.name).toBe("Tifa");
      expect(savedTifa.appearance?.hairLength).toBe("mittel");
      expect(savedTifa.appearance?.chonkiness).toBe("normal");
      expect(savedTifa.personalityTags).toContain("gentle");

      expect(savedCloud.name).toBe("Cloud");
      expect(savedCloud.appearance?.hairLength).toBe("kurz");
      expect(savedCloud.appearance?.chonkiness).toBe("schlank");
      expect(savedCloud.personalityTags).toContain("independent");

      expect(savedBarret.name).toBe("Barret");
      expect(savedBarret.appearance?.hairLength).toBe("lang");
      expect(savedBarret.appearance?.chonkiness).toBe("mollig");
      expect(savedBarret.personalityTags).toContain("bold");
    });
  });

  /**
   * Test: Validation of required fields.
   *
   * Ensures that cats cannot be created without required fields
   * and that appropriate error messages are returned.
   */
  describe("Validation", () => {
    test("should fail to create cat without name", async () => {
      const catData = { ...testCats.tifa };
      const { name, ...catDataWithoutName } = catData;

      const cat = new Cat(catDataWithoutName);

      await expect(cat.save()).rejects.toThrow();
    });

    test("should fail to create cat without location", async () => {
      const catData = { ...testCats.tifa };
      const { location, ...catDataWithoutLocation } = catData;

      const cat = new Cat(catDataWithoutLocation);

      await expect(cat.save()).rejects.toThrow();
    });

    test("should fail to create cat with invalid hair length", async () => {
      const catData = {
        ...testCats.tifa,
        appearance: {
          ...testCats.tifa.appearance,
          hairLength: "invalid",
        },
      };

      const cat = new Cat(catData);

      await expect(cat.save()).rejects.toThrow();
    });

    test("should fail to create cat with invalid chonkiness", async () => {
      const catData = {
        ...testCats.tifa,
        appearance: {
          ...testCats.tifa.appearance,
          chonkiness: "invalid",
        },
      };

      const cat = new Cat(catData);

      await expect(cat.save()).rejects.toThrow();
    });
  });

  /**
   * Test: Database queries and retrieval operations.
   *
   * Validates that cats can be found, updated, and deleted
   * using various query methods.
   */
  describe("Database Queries", () => {
    beforeEach(async () => {
      // Create test cats for query tests
      await Cat.create(testCats.tifa);
      await Cat.create(testCats.cloud);
      await Cat.create(testCats.barret);
    });

    test("should find all cats", async () => {
      const cats = await Cat.find();

      expect(cats).toHaveLength(3);
      expect(cats.map((cat) => cat.name)).toContain("Tifa");
      expect(cats.map((cat) => cat.name)).toContain("Cloud");
      expect(cats.map((cat) => cat.name)).toContain("Barret");
    });

    test("should find cat by name", async () => {
      const tifa = await Cat.findOne({ name: "Tifa" });

      expect(tifa).toBeDefined();
      expect(tifa?.name).toBe("Tifa");
      expect(tifa?.location).toBe("Midgar, Sector 7");
      expect(tifa?.personalityTags).toContain("gentle");
    });

    test("should find cats by personality tag", async () => {
      const protectiveCats = await Cat.find({ personalityTags: "protective" });

      expect(protectiveCats).toHaveLength(2); // Tifa and Barret are protective
      expect(protectiveCats.map((cat) => cat.name)).toContain("Tifa");
      expect(protectiveCats.map((cat) => cat.name)).toContain("Barret");
    });

    test("should find cats by appearance characteristics", async () => {
      const shortHairCats = await Cat.find({ "appearance.hairLength": "kurz" });
      const normalBuildCats = await Cat.find({
        "appearance.chonkiness": "normal",
      });

      expect(shortHairCats).toHaveLength(1);
      expect(shortHairCats[0].name).toBe("Cloud");

      expect(normalBuildCats).toHaveLength(1);
      expect(normalBuildCats[0].name).toBe("Tifa");
    });

    test("should update cat information", async () => {
      const tifa = await Cat.findOne({ name: "Tifa" });
      expect(tifa).toBeDefined();

      if (tifa) {
        tifa.location = "Updated Location";
        tifa.personalityTags.push("playful");
        const updatedTifa = await tifa.save();

        expect(updatedTifa.location).toBe("Updated Location");
        expect(updatedTifa.personalityTags).toContain("playful");
        expect(updatedTifa.personalityTags).toContain("gentle");
      }
    });

    test("should delete a cat", async () => {
      const initialCount = await Cat.countDocuments();
      expect(initialCount).toBe(3);

      const deletedCat = await Cat.findOneAndDelete({ name: "Cloud" });
      expect(deletedCat).toBeDefined();
      expect(deletedCat?.name).toBe("Cloud");

      const finalCount = await Cat.countDocuments();
      expect(finalCount).toBe(2);

      const remainingCats = await Cat.find();
      expect(remainingCats.map((cat) => cat.name)).not.toContain("Cloud");
    });
  });

  /**
   * Test: Edge cases and special scenarios.
   *
   * Validates behavior with empty arrays, null values,
   * and other edge cases.
   */
  describe("Edge Cases", () => {
    test("should handle empty arrays for images and personality tags", async () => {
      const catData = {
        name: "Empty Arrays Cat",
        location: "Test Location",
        images: [],
        personalityTags: [],
      };

      const cat = new Cat(catData);
      const savedCat = await cat.save();

      expect(savedCat.images).toEqual([]);
      expect(savedCat.personalityTags).toEqual([]);
    });

    test("should handle cat with no appearance data", async () => {
      const catData = {
        name: "No Appearance Cat",
        location: "Test Location",
      };

      const cat = new Cat(catData);
      const savedCat = await cat.save();

      expect(savedCat.appearance).toEqual({});
    });

    test("should handle cat with partial appearance data", async () => {
      const catData = {
        name: "Partial Appearance Cat",
        location: "Test Location",
        appearance: {
          furColor: "white",
          breed: "Persian",
        },
      };

      const cat = new Cat(catData);
      const savedCat = await cat.save();

      expect(savedCat.appearance?.furColor).toBe("white");
      expect(savedCat.appearance?.breed).toBe("Persian");
      expect(savedCat.appearance?.furPattern).toBeUndefined();
      expect(savedCat.appearance?.hairLength).toBeUndefined();
      expect(savedCat.appearance?.chonkiness).toBeUndefined();
    });

    test("should handle very long names and locations", async () => {
      const longName = "A".repeat(100);
      const longLocation = "B".repeat(200);

      const catData = {
        name: longName,
        location: longLocation,
      };

      const cat = new Cat(catData);
      const savedCat = await cat.save();

      expect(savedCat.name).toBe(longName);
      expect(savedCat.location).toBe(longLocation);
    });
  });

  /**
   * Test: Schema field validation and constraints.
   *
   * Validates that the schema properly enforces field types,
   * enums, and other constraints.
   */
  describe("Schema Validation", () => {
    test("should validate enum values for hair length", async () => {
      const validHairLengths = ["kurz", "mittel", "lang"];

      for (const hairLength of validHairLengths) {
        const catData = {
          name: `Test Cat ${hairLength}`,
          location: "Test Location",
          appearance: { hairLength },
        };

        const cat = new Cat(catData);
        const savedCat = await cat.save();
        expect(savedCat.appearance?.hairLength).toBe(hairLength);
      }
    });

    test("should validate enum values for chonkiness", async () => {
      const validChonkiness = ["schlank", "normal", "mollig", "übergewichtig"];

      for (const chonkiness of validChonkiness) {
        const catData = {
          name: `Test Cat ${chonkiness}`,
          location: "Test Location",
          appearance: { chonkiness },
        };

        const cat = new Cat(catData);
        const savedCat = await cat.save();
        expect(savedCat.appearance?.chonkiness).toBe(chonkiness);
      }
    });

    test("should trim string fields", async () => {
      const catData = {
        name: "  Trimmed Cat  ",
        location: "  Trimmed Location  ",
        appearance: {
          furColor: "  white  ",
          breed: "  Persian  ",
        },
      };

      const cat = new Cat(catData);
      const savedCat = await cat.save();

      expect(savedCat.name).toBe("Trimmed Cat");
      expect(savedCat.location).toBe("Trimmed Location");
      expect(savedCat.appearance?.furColor).toBe("white");
      expect(savedCat.appearance?.breed).toBe("Persian");
    });
  });
});
