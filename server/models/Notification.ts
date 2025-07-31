/**
 * @fileoverview Notification model for the Pawsitiv Cat Adoption Platform
 * @description Handles all database operations related to notifications including CRUD operations and notification management
 * @author Pawsitiv Development Team
 * @version 1.0.0
 */

import { getClient } from "../db/connection";

/**
 * Valid notification types
 */
export type NotificationType =
  | "neue_katze"
  | "update_katze"
  | "match"
  | "nachricht";

/**
 * Interface representing a notification in the system
 */
export interface Notification {
  /** Unique identifier for the notification */
  id?: number;
  /** ID of the user who receives the notification */
  userId: number;
  /** ID of the cat related to the notification */
  catId: number;
  /** Type of notification */
  type: NotificationType;
  /** Timestamp when notification was created */
  timestamp?: Date;
  /** Whether the notification has been seen by the user */
  seen: boolean;
}

/**
 * Data required to create a new notification (excluding auto-generated fields)
 */
export type CreateNotificationData = Omit<Notification, "id" | "timestamp">;

/**
 * Data that can be updated for a notification
 */
export type UpdateNotificationData = Partial<
  Omit<Notification, "id" | "timestamp" | "userId" | "catId">
>;

/**
 * Notification model class providing static methods for database operations
 */
export class NotificationModel {
  /**
   * Creates a new notification in the database
   * @param notificationData - Notification data to create
   * @returns Promise resolving to the created notification
   * @throws {Error} If notification creation fails
   */
  static async create(
    notificationData: CreateNotificationData
  ): Promise<Notification> {
    const client = await getClient();
    try {
      const result = await client.query(
        `INSERT INTO notifications (user_id, cat_id, type, seen) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, user_id, cat_id, type, timestamp, seen`,
        [
          notificationData.userId,
          notificationData.catId,
          notificationData.type,
          notificationData.seen,
        ]
      );

      return this.mapRowToNotification(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Finds a notification by its ID
   * @param id - Notification ID to search for
   * @returns Promise resolving to notification or null if not found
   */
  static async findById(id: number): Promise<Notification | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, user_id, cat_id, type, timestamp, seen FROM notifications WHERE id = $1",
        [id]
      );

      return result.rows.length > 0
        ? this.mapRowToNotification(result.rows[0])
        : null;
    } finally {
      client.release();
    }
  }

  /**
   * Finds all notifications for a specific user
   * @param userId - User ID to get notifications for
   * @returns Promise resolving to array of notifications
   */
  static async findByUserId(userId: number): Promise<Notification[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, user_id, cat_id, type, timestamp, seen FROM notifications WHERE user_id = $1 ORDER BY timestamp DESC",
        [userId]
      );

      return result.rows.map((row) => this.mapRowToNotification(row));
    } finally {
      client.release();
    }
  }

  /**
   * Finds all notifications related to a specific cat
   * @param catId - Cat ID to get notifications for
   * @returns Promise resolving to array of notifications
   */
  static async findByCatId(catId: number): Promise<Notification[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, user_id, cat_id, type, timestamp, seen FROM notifications WHERE cat_id = $1 ORDER BY timestamp DESC",
        [catId]
      );

      return result.rows.map((row) => this.mapRowToNotification(row));
    } finally {
      client.release();
    }
  }

  /**
   * Gets all unseen notifications for a specific user
   * @param userId - User ID to get unseen notifications for
   * @returns Promise resolving to array of unseen notifications
   */
  static async getUnseenByUserId(userId: number): Promise<Notification[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, user_id, cat_id, type, timestamp, seen FROM notifications WHERE user_id = $1 AND seen = false ORDER BY timestamp DESC",
        [userId]
      );

      return result.rows.map((row) => this.mapRowToNotification(row));
    } finally {
      client.release();
    }
  }

  /**
   * Marks a notification as seen
   * @param id - Notification ID to mark as seen
   * @returns Promise resolving to updated notification or null if not found
   */
  static async markAsSeen(id: number): Promise<Notification | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        `UPDATE notifications SET seen = true WHERE id = $1 
         RETURNING id, user_id, cat_id, type, timestamp, seen`,
        [id]
      );

      return result.rows.length > 0
        ? this.mapRowToNotification(result.rows[0])
        : null;
    } finally {
      client.release();
    }
  }

  /**
   * Marks all notifications for a user as seen
   * @param userId - User ID to mark all notifications as seen for
   */
  static async markAllAsSeen(userId: number): Promise<void> {
    const client = await getClient();
    try {
      await client.query(
        "UPDATE notifications SET seen = true WHERE user_id = $1",
        [userId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Deletes a notification from the database
   * @param id - Notification ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  static async delete(id: number): Promise<boolean> {
    const client = await getClient();
    try {
      const result = await client.query(
        "DELETE FROM notifications WHERE id = $1",
        [id]
      );
      return (result.rowCount || 0) > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Deletes all notifications for a specific user
   * @param userId - User ID to delete all notifications for
   */
  static async deleteByUserId(userId: number): Promise<void> {
    const client = await getClient();
    try {
      await client.query("DELETE FROM notifications WHERE user_id = $1", [
        userId,
      ]);
    } finally {
      client.release();
    }
  }

  /**
   * Deletes all notifications related to a specific cat
   * @param catId - Cat ID to delete all notifications for
   */
  static async deleteByCatId(catId: number): Promise<void> {
    const client = await getClient();
    try {
      await client.query("DELETE FROM notifications WHERE cat_id = $1", [
        catId,
      ]);
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves all notifications from the database
   * @returns Promise resolving to array of all notifications
   */
  static async getAll(): Promise<Notification[]> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, user_id, cat_id, type, timestamp, seen FROM notifications ORDER BY timestamp DESC"
      );

      return result.rows.map((row) => this.mapRowToNotification(row));
    } finally {
      client.release();
    }
  }

  /**
   * Maps database row to Notification interface
   * @param row - Database row object
   * @returns Notification object
   */
  private static mapRowToNotification(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      catId: row.cat_id,
      type: row.type,
      timestamp: row.timestamp,
      seen: row.seen,
    };
  }
}
