const { connectDB, closeDB, getClient } = require('./db/connection');

beforeAll(async () => {
  // Connect to test database
  process.env.POSTGRES_DB = 'pawsitiv_test';
  await connectDB();
  
  // Clear all tables before running tests
  const client = await getClient();
  try {
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM user_cat_subscriptions');
    await client.query('DELETE FROM cats');
    await client.query('DELETE FROM users');
  } finally {
    client.release();
  }
});

afterAll(async () => {
  // Close database connection
  await closeDB();
});

afterEach(async () => {
  // Clear all tables after each test
  const client = await getClient();
  try {
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM user_cat_subscriptions');
    await client.query('DELETE FROM cats');
    await client.query('DELETE FROM users');
  } finally {
    client.release();
  }
}); 