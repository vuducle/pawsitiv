import { connectDB, getClient, closeDB } from "./connection";

const createTables = async () => {
  const client = await getClient();

  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        profile_picture VARCHAR(500) DEFAULT '/twice-stan.jpg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN DEFAULT FALSE
        ) 
      `);

    // Create cats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        images TEXT[] DEFAULT '{}',
        personality_tags TEXT[] DEFAULT '{}',
        fur_color VARCHAR(100),
        fur_pattern VARCHAR(100),
        breed VARCHAR(100),
        hair_length VARCHAR(20) CHECK (hair_length IN ('kurz', 'mittel', 'lang')),
        chonkiness VARCHAR(20) CHECK (chonkiness IN ('schlank', 'normal', 'mollig', 'übergewichtig')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('neue_katze', 'update_katze', 'match', 'nachricht')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        seen BOOLEAN DEFAULT FALSE
      )
    `);

    // Create user_cat_subscriptions table for many-to-many relationship
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_cat_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, cat_id)
      )
    `);

    // migration 2
    await client.query(`
      CREATE TABLE IF NOT EXISTS cat_images (
        id SERIAL PRIMARY KEY,
        cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
        data BYTEA NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() 
      )
    `);

    console.log("✅ Database tables created successfully");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};

const main = async () => {
  try {
    await connectDB();
    await createTables();
    console.log("🎉 Database migration completed successfully");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await closeDB();
  }
};

if (require.main === module) {
  main();
}
