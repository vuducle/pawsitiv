/**
 * @file db_seed_users.test.ts
 * @jest-environment node
 *
 * Tests for seeding and verifying user creation in the database.
 *
 * This test suite connects to the MongoDB test database, clears the User collection,
 * creates several users (Cong Nguyen Dinh, Vu Minh Le, Linh Chi Nguyen), and verifies
 * their presence and data integrity. Uses direct model access (no HTTP).
 *
 * @module tests/db_seed_users
 */

import { connectDB, closeDB } from "../db/connection";
import User from "../models/User";
import request from "supertest";
// Import the Express app for E2E testing
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../app");

describe("User seeding and retrieval", () => {
  /**
   * Connect to the database before all tests.
   * Clear the User collection to ensure a clean slate.
   */
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  /**
   * Close the database connection after all tests.
   */
  afterAll(async () => {
    await closeDB();
  });

  /**
   * Test user data for seeding.
   */
  const testUsers = [
    {
      name: "Cong Nguyen Dinh",
      username: "congnguyendinh",
      password: "congnguyendinh",
      email: "cong.nguyendinh@example.com",
      profilePicture: "/upload/profile/congnguyendinh.jpg",
    },
    {
      name: "Vu Minh Le",
      username: "vuminhle",
      password: "vuminhle",
      email: "vu.minhle@example.com",
      profilePicture: "/upload/profile/vuminhle.jpg",
    },
    {
      name: "Linh Chi Nguyen",
      username: "linhchinnguyen",
      password: "linhchinnguyen",
      email: "linhchi.nguyen@example.com",
      profilePicture: "/upload/profile/linhchinnguyen.jpg",
    },
  ];

  /**
   * Test: Seed users and verify their creation and retrieval.
   *
   * @remarks
   * - Ensures that users are created with correct fields.
   * - Passwords should be hashed in the database.
   * - Usernames and emails should be unique and lowercased.
   */
  it("should create and retrieve seeded users correctly", async () => {
    // Create users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
    }

    // Retrieve all users
    const users = await User.find({});
    expect(users).toHaveLength(testUsers.length);

    // Check each user
    for (const testUser of testUsers) {
      const found = users.find((u) => u.username === testUser.username);
      expect(found).toBeDefined();
      expect(found?.name).toBe(testUser.name);
      expect(found?.email).toBe(testUser.email.toLowerCase());
      expect(found?.profilePicture).toBe(testUser.profilePicture);
      // Password should not be stored in plain text
      expect(found?.password).not.toBe(testUser.password);
      // Password should be hashed (60 chars for bcrypt)
      expect(found?.password.length).toBe(60);
    }
  });

  /**
   * End-to-End Test: Create and retrieve users via REST API
   *
   * @remarks
   * - Uses Supertest to POST users to /api/users and GET them back.
   * - Verifies API responses and user data integrity.
   */
  it("E2E: should create and retrieve users via REST API", async () => {
    // Clear users before E2E test
    await User.deleteMany({});

    // Create users via API
    for (const userData of testUsers) {
      const res = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);
      // Response should contain the user (without plain password)
      expect(res.body).toMatchObject({
        name: userData.name,
        username: userData.username,
        email: userData.email.toLowerCase(),
        profilePicture: userData.profilePicture,
      });
      expect(res.body.password).not.toBe(userData.password);
    }

    // Retrieve all users via API
    const getRes = await request(app).get("/api/users").expect(200);
    expect(getRes.body.length).toBe(testUsers.length);
    for (const userData of testUsers) {
      const found = getRes.body.find(
        (u: any) => u.username === userData.username
      );
      expect(found).toBeDefined();
      expect(found.name).toBe(userData.name);
      expect(found.email).toBe(userData.email.toLowerCase());
      expect(found.profilePicture).toBe(userData.profilePicture);
      expect(found.password).not.toBe(userData.password);
      expect(found.password.length).toBe(60);
    }
  });
});
