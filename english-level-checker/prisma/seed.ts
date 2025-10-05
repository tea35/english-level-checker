import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ユーザーを作成
  const user1 = await prisma.user.create({
    data: {
      email: "testuser1@example.com",
      name: "Test User 1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "testuser2@example.com",
      name: "Test User 2",
    },
  });

  // テストを作成
  const test1 = await prisma.test.create({
    data: {
      userId: user1.id,
      cefrLevel: "B1",
      totalScore: 75.5,
      quality: "standard",
      wordCount: 120,
      summary: "Overall good performance.",
    },
  });

  const test2 = await prisma.test.create({
    data: {
      userId: user2.id,
      cefrLevel: "A2",
      totalScore: 60.0,
      quality: "basic",
      wordCount: 80,
      summary: "Needs improvement in vocabulary.",
    },
  });

  // 会話のターンを作成
  await prisma.turn.createMany({
    data: [
      {
        testId: test1.id,
        turnNumber: 1,
        speaker: "CANDIDATE",
        transcript: "Hello, how are you?",
        timestamp: new Date(),
      },
      {
        testId: test1.id,
        turnNumber: 2,
        speaker: "EXAMINER",
        transcript: "I am fine, thank you. And you?",
        timestamp: new Date(),
      },
      {
        testId: test2.id,
        turnNumber: 1,
        speaker: "CANDIDATE",
        transcript: "I like to watch movies.",
        timestamp: new Date(),
      },
    ],
  });

  // スコアを作成
  await prisma.score.createMany({
    data: [
      { testId: test1.id, category: "fluency", score: 8.5 },
      { testId: test1.id, category: "grammar", score: 7.0 },
      { testId: test2.id, category: "vocabulary", score: 6.0 },
      { testId: test2.id, category: "pronunciation", score: 5.5 },
    ],
  });

  // フィードバックを作成
  await prisma.feedback.createMany({
    data: [
      {
        testId: test1.id,
        problematicPoints: "Some grammatical errors.",
        strengths: "Good fluency.",
        nextSteps: "Focus on grammar.",
      },
      {
        testId: test2.id,
        problematicPoints: "Limited vocabulary.",
        strengths: "Clear pronunciation.",
        nextSteps: "Expand your vocabulary.",
      },
    ],
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
