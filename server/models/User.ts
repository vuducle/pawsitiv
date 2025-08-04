/**
 * @fileoverview User model for the Pawsitiv Cat Adoption Platform
 * @description Handles all database operations related to users including CRUD operations, authentication, and subscription management
 * @author Pawsitiv Development Team
 * @version 1.0.0
 */

import { getClient } from "../db/connection";
const bcrypt = require("bcryptjs");

/**
 * Interface representing a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id?: number;
  /** Full name of the user */
  name: string;
  /** Unique username for login */
  username: string;
  /** Hashed password */
  password: string;
  /** Email address (must be unique) */
  email: string;
  /** URL to user's profile picture */
  profilePicture: string;
  /** Timestamp when user was created */
  createdAt?: Date;
  /** Whether the user has admin privileges */
  isAdmin: boolean;
}

/**
 * Extended user interface that includes subscribed cats
 */
export interface UserWithSubscriptions extends User {
  /** Array of cat IDs that the user is subscribed to */
  subscribedCats: number[];
}

/**
 * Data required to create a new user (excluding auto-generated fields)
 */
export type CreateUserData = Omit<User, "id" | "createdAt">;

/**
 * Data that can be updated for a user
 */
export type UpdateUserData = Partial<
  Omit<User, "id" | "createdAt" | "password">
> & {
  password?: string;
};

/**
 * User model class providing static methods for database operations
 */
export class UserModel {
  /**
   * Creates a new user in the database
   * @param userData - User data to create (password will be hashed)
   * @returns Promise resolving to the created user
   * @throws {Error} If user creation fails
   */
  static async create(userData: CreateUserData): Promise<User> {
    const client = await getClient();
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const result = await client.query(
        `INSERT INTO users (name, username, password, email, profile_picture, is_admin) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, name, username, password, email, profile_picture, created_at, is_admin`,
        [
          userData.name,
          userData.username,
          hashedPassword,
          userData.email,
          userData.profilePicture,
          userData.isAdmin,
        ]
      );

      return this.mapRowToUser(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Finds a user by their ID
   * @param id - User ID to search for
   * @returns Promise resolving to user or null if not found
   */
  static async findById(id: number): Promise<User | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, username, password, email, profile_picture, created_at, is_admin FROM users WHERE id = $1",
        [id]
      );

      return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Finds a user by their username
   * @param username - Username to search for
   * @returns Promise resolving to user or null if not found
   */
  static async findByUsername(username: string): Promise<User | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, username, password, email, profile_picture, created_at, is_admin FROM users WHERE username = $1",
        [username]
      );

      return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Finds a user by their email address
   * @param email - Email address to search for
   * @returns Promise resolving to user or null if not found
   */
  static async findByEmail(email: string): Promise<User | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, username, password, email, profile_picture, created_at, is_admin FROM users WHERE email = $1",
        [email]
      );

      return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Updates a user's information
   * @param id - User ID to update
   * @param updates - Object containing fields to update
   * @returns Promise resolving to updated user or null if not found
   */
  static async update(
    id: number,
    updates: UpdateUserData
  ): Promise<User | null> {
    const client = await getClient();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          const dbField = this.mapFieldToDb(key);
          fields.push(`${dbField} = $${paramCount++}`);
          values.push(value);
        }
      });

      if (fields.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} 
         RETURNING id, name, username, password, email, profile_picture, created_at, is_admin`,
        values
      );

      return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Deletes a user from the database
   * @param id - User ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  static async delete(id: number): Promise<boolean> {
    const client = await getClient();
    try {
      const result = await client.query("DELETE FROM users WHERE id = $1", [
        id,
      ]);
      return (result.rowCount || 0) > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves all users from the database
   * @returns Promise resolving to array of all users
   */
  static async getAll(): Promise<User[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, username, password, email, profile_picture, created_at, is_admin FROM users ORDER BY created_at DESC"
      );

      return result.rows.map((row) => this.mapRowToUser(row));
    } finally {
      client.release();
    }
  }

  /**
   * Gets all cat IDs that a user is subscribed to
   * @param userId - User ID to get subscriptions for
   * @returns Promise resolving to array of cat IDs
   */
  static async getSubscribedCats(userId: number): Promise<number[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT cat_id FROM user_cat_subscriptions WHERE user_id = $1",
        [userId]
      );

      return result.rows.map((row) => row.cat_id);
    } finally {
      client.release();
    }
  }

  /**
   * Adds a cat subscription for a user
   * @param userId - User ID
   * @param catId - Cat ID to subscribe to
   * @throws {Error} If subscription already exists or operation fails
   */
  static async addSubscribedCat(userId: number, catId: number): Promise<void> {
    const client = await getClient();
    try {
      await client.query(
        "INSERT INTO user_cat_subscriptions (user_id, cat_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [userId, catId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Removes a cat subscription for a user
   * @param userId - User ID
   * @param catId - Cat ID to unsubscribe from
   */
  static async removeSubscribedCat(
    userId: number,
    catId: number
  ): Promise<void> {
    const client = await getClient();
    try {
      await client.query(
        "DELETE FROM user_cat_subscriptions WHERE user_id = $1 AND cat_id = $2",
        [userId, catId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Verifies if a password matches the user's hashed password
   * @param user - User object containing the hashed password
   * @param enteredPassword - Plain text password to verify
   * @returns Promise resolving to true if password matches, false otherwise
   */
  static async matchPassword(
    user: User,
    enteredPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, user.password);
  }

  /**
   * Maps database row to User interface
   * @param row - Database row object
   * @returns User object
   */
  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      password: row.password,
      email: row.email,
      profilePicture: row.profile_picture,
      createdAt: row.created_at,
      isAdmin: row.is_admin,
    };
  }

  /**
   * Maps JavaScript field names to database column names
   * @param field - JavaScript field name
   * @returns Database column name
   */
  private static mapFieldToDb(field: string): string {
    const fieldMap: Record<string, string> = {
      profilePicture: "profile_picture",
      createdAt: "created_at",
      isAdmin: "is_admin",
    };

    return fieldMap[field] || field;
  }
}
