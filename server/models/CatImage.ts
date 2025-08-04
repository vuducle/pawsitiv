import { getClient } from "../db/connection";

export interface CatImage {
  id?: number;
  catId: number;
  data: Buffer;
  createdAt?: Date;
}

export class CatImageModel {
  static async create(
    image: Omit<CatImage, "id" | "createdAt">
  ): Promise<CatImage> {
    const client = await getClient();
    try {
      const result = await client.query(
        "INSERT INTO cat_images (cat_id, data) VALUES ($1, $2) RETURNING id, cat_id, data, created_at",
        [image.catId, image.data]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByCatId(catId: number): Promise<CatImage[] | null> {
    const client = await getClient();
    try {
      const result = await client.query(
        "SELECT id, cat_id, data, created_at FROM cat_images WHERE cat_id = $1 ORDER BY created_at DESC",
        [catId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}
