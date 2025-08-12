import { db } from "./src/server/db.js";

async function testPrisma() {
  try {
    // Test connection
    await db.$connect();
    console.log("✅ Database connection successful");

    // Test if our models are available
    const userCount = await db.user.count();
    console.log(`✅ User count: ${userCount}`);

    const questionCount = await db.question.count();
    console.log(`✅ Question count: ${questionCount}`);

    const voteCount = await db.vote.count();
    console.log(`✅ Vote count: ${voteCount}`);

  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await db.$disconnect();
  }
}

testPrisma();
