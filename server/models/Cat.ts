/**
 * @fileoverview Cat model for the Pawsitiv Cat Adoption Platform
 * @description Handles all database operations related to cats including CRUD operations, image management, and search functionality
 * @author Pawsitiv Development Team
 * @version 1.0.0
 */

import { getClient } from "../db/connection";

/**
 * Valid hair length options for cats
 */
export type HairLength = "kurz" | "mittel" | "lang";

/**
 * Valid chonkiness levels for cats
 */
export type Chonkiness = "schlank" | "normal" | "mollig" | "übergewichtig";

/**
 * Interface representing a cat's physical appearance
 */
export interface Appearance {
  /** Color of the cat's fur */
  furColor: string;
  /** Pattern of the cat's fur (e.g., tabby, solid, calico) */
  furPattern: string;
  /** Breed of the cat */
  breed: string;
  /** Length of the cat's hair */
  hairLength: HairLength;
  /** Body condition/weight of the cat */
  chonkiness: Chonkiness;
}

/**
 * Interface representing a cat in the system
 */
export interface Cat {
  /** Unique identifier for the cat */
  id?: number;
  /** Name of the cat */
  name: string;
  /** Location where the cat was found or is located */
  location: string;
  /** Array of personality traits/tags */
  personalityTags: string[];
  /** Physical appearance details */
  appearance: Appearance;
  /** Timestamp when cat profile was created */
  createdAt?: Date;
}

/**
 * Data required to create a new cat (excluding auto-generated fields)
 */
export type CreateCatData = Omit<Cat, "id" | "createdAt">;

/**
 * Data that can be updated for a cat
 */
export type UpdateCatData = Partial<Omit<Cat, "id" | "createdAt">>;

/**
 * Cat model class providing static methods for database operations
 */
export class CatModel {
  /**
   * Creates a new cat in the database
   * @param catData - Cat data to create
   * @returns Promise resolving to the created cat
   * @throws {Error} If cat creation fails
   */
  static async create(catData: CreateCatData): Promise<Cat> {
    const client = await getClient();
    try {
      const result = await client.query(
        `INSERT INTO cats (name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at`,
        [
          catData.name,
          catData.location,
          catData.personalityTags,
          catData.appearance.furColor,
          catData.appearance.furPattern,
          catData.appearance.breed,
          catData.appearance.hairLength,
          catData.appearance.chonkiness,
        ]
      );

      return this.mapRowToCat(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Finds a cat by their ID
   * @param id - Cat ID to search for
   * @returns Promise resolving to cat or null if not found
   */
  static async findById(id: number): Promise<Cat | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at FROM cats WHERE id = $1",
        [id]
      );

      return result.rows.length > 0 ? this.mapRowToCat(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves all cats from the database
   * @returns Promise resolving to array of all cats
   */
  static async getAll(): Promise<Cat[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at FROM cats ORDER BY created_at DESC"
      );

      return result.rows.map((row) => this.mapRowToCat(row));
    } finally {
      client.release();
    }
  }

  /**
   * Updates a cat's information
   * @param id - Cat ID to update
   * @param updates - Object containing fields to update
   * @returns Promise resolving to updated cat or null if not found
   */
  static async update(id: number, updates: UpdateCatData): Promise<Cat | null> {
    const client = await getClient();
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          const dbField = this.mapFieldToDb(key);
          if (key === "appearance") {
            // Handle nested appearance object
            Object.entries(value as Appearance).forEach(
              ([appKey, appValue]) => {
                const appDbField = this.mapAppearanceFieldToDb(appKey);
                fields.push(`${appDbField} = $${paramCount++}`);
                values.push(appValue);
              }
            );
          } else {
            fields.push(`${dbField} = $${paramCount++}`);
            values.push(value);
          }
        }
      });

      if (fields.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE cats SET ${fields.join(", ")} WHERE id = $${paramCount} 
         RETURNING id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at`,
        values
      );

      return result.rows.length > 0 ? this.mapRowToCat(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Deletes a cat from the database
   * @param id - Cat ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  static async delete(id: number): Promise<boolean> {
    const client = await getClient();
    try {
      const result = await client.query("DELETE FROM cats WHERE id = $1", [id]);
      return (result.rowCount || 0) > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Finds cats by location
   * @param location - Location to search for
   * @returns Promise resolving to array of cats in that location
   */
  static async findByLocation(location: string): Promise<Cat[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at FROM cats WHERE location ILIKE $1 ORDER BY created_at DESC",
        [`%${location}%`]
      );

      return result.rows.map((row) => this.mapRowToCat(row));
    } finally {
      client.release();
    }
  }

  /**
   * Finds cats by breed
   * @param breed - Breed to search for
   * @returns Promise resolving to array of cats of that breed
   */
  static async findByBreed(breed: string): Promise<Cat[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, name, location, personality_tags, fur_color, fur_pattern, breed, hair_length, chonkiness, created_at FROM cats WHERE breed ILIKE $1 ORDER BY created_at DESC",
        [`%${breed}%`]
      );

      return result.rows.map((row) => this.mapRowToCat(row));
    } finally {
      client.release();
    }
  }

  /**
   * Maps database row to Cat interface
   * @param row - Database row object
   * @returns Cat object
   */
  private static mapRowToCat(row: any): Cat {
    return {
      id: row.id,
      name: row.name,
      location: row.location,
      personalityTags: row.personality_tags || [],
      appearance: {
        furColor: row.fur_color,
        furPattern: row.fur_pattern,
        breed: row.breed,
        hairLength: row.hair_length,
        chonkiness: row.chonkiness,
      },
      createdAt: row.created_at,
    };
  }

  /**
   * Maps JavaScript field names to database column names
   * @param field - JavaScript field name
   * @returns Database column name
   */
  private static mapFieldToDb(field: string): string {
    const fieldMap: Record<string, string> = {
      personalityTags: "personality_tags",
      createdAt: "created_at",
    };

    return fieldMap[field] || field;
  }

  /**
   * Maps appearance field names to database column names
   * @param field - Appearance field name
   * @returns Database column name
   */
  private static mapAppearanceFieldToDb(field: string): string {
    const fieldMap: Record<string, string> = {
      furColor: "fur_color",
      furPattern: "fur_pattern",
      hairLength: "hair_length",
    };

    return fieldMap[field] || field;
  }
}
