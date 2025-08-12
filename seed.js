import { db } from "./src/server/db.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Creating sample data...");

  // Create a sample user
  const hashedPassword = await bcrypt.hash("password123", 12);
  
  const user = await db.user.create({
    data: {
      username: "demo",
      password: hashedPassword,
    },
  });

  console.log(`Created user: ${user.username}`);

  // Create some sample questions
  const questions = [
    {
      optionA: "Have the ability to fly",
      optionB: "Have the ability to be invisible",
      authorId: user.id,
    },
    {
      optionA: "Live in the past",
      optionB: "Live in the future",
      authorId: user.id,
    },
    {
      optionA: "Always be 10 minutes late",
      optionB: "Always be 20 minutes early",
      authorId: user.id,
    },
  ];

  for (const questionData of questions) {
    const question = await db.question.create({
      data: questionData,
    });
    console.log(`Created question: "${question.optionA}" vs "${question.optionB}"`);
  }

  console.log("Sample data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
