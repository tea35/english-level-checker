import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 既存データをクリア（順序重要: 外部キー制約のため）
  console.log("Cleaning existing data...");
  await prisma.paraphrase.deleteMany();
  await prisma.evaluationDetail.deleteMany();
  await prisma.vocabularyCard.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.score.deleteMany();
  await prisma.turn.deleteMany();
  await prisma.test.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();

  // 複数のユーザーを作成
  console.log("Creating users...");
  const user1 = await prisma.user.create({
    data: {
      email: "testuser1@example.com",
      name: "山田太郎",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "testuser2@example.com",
      name: "佐藤花子",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
    },
  });

  // OTP（ワンタイムパスワード）を作成
  console.log("Creating OTPs...");
  await prisma.otp.create({
    data: {
      userId: user1.id,
      code: "123456",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10分後
    },
  });

  await prisma.otp.create({
    data: {
      userId: user2.id,
      code: "789012",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15分後
    },
  });

  // テストデータを作成（履歴ページ用）
  console.log("Creating tests...");
  const test1 = await prisma.test.create({
    data: {
      userId: user1.id,
      cefrLevel: "B1",
      totalScore: 78.2,
      quality: "standard",
      wordCount: 185,
      summary:
        "受験者は、提示された日常的なトピック（週末の予定）について、十分な長さと詳細さで応答できています。",
      createdAt: new Date("2025-10-06T10:00:00Z"),
    },
  });

  const test2 = await prisma.test.create({
    data: {
      userId: user1.id,
      cefrLevel: "A2",
      totalScore: 65.3,
      quality: "standard",
      wordCount: 120,
      summary: "基本的な日常会話はできているが、語彙の制限が見られます。",
      createdAt: new Date("2025-10-05T14:30:00Z"),
    },
  });

  const test3 = await prisma.test.create({
    data: {
      userId: user1.id,
      cefrLevel: "B2",
      totalScore: 82.0,
      quality: "advanced",
      wordCount: 167,
      summary: "複雑なトピックについても流暢に話すことができています。",
      createdAt: new Date("2025-10-04T16:45:00Z"),
    },
  });

  const test4 = await prisma.test.create({
    data: {
      userId: user2.id, // user2に変更
      cefrLevel: "A1",
      totalScore: 42.8,
      quality: "standard",
      wordCount: 85,
      summary: "基本的な挨拶や自己紹介はできるが、語彙と文法に課題があります。",
      createdAt: new Date("2025-09-17T21:51:00Z"),
    },
  });

  const test5 = await prisma.test.create({
    data: {
      userId: user2.id, // user2に変更
      cefrLevel: "A2",
      totalScore: 58.7,
      quality: "standard",
      wordCount: 102,
      summary: "身近なトピックについて短い会話ができています。",
      createdAt: new Date("2025-09-17T19:07:00Z"),
    },
  });

  const test6 = await prisma.test.create({
    data: {
      userId: user3.id, // user3の追加テスト
      cefrLevel: "C1",
      totalScore: 91.5,
      quality: "advanced",
      wordCount: 280,
      summary:
        "抽象的なトピックについても詳細に議論することができ、優秀なレベルです。",
      createdAt: new Date("2025-10-03T09:15:00Z"),
    },
  });

  // スコアを作成
  console.log("Creating scores...");
  await prisma.score.createMany({
    data: [
      // Test 1 (B1)
      { testId: test1.id, category: "流暢さ", score: 75.0 },
      { testId: test1.id, category: "やりとり力", score: 80.0 },
      { testId: test1.id, category: "文法", score: 70.0 },
      { testId: test1.id, category: "語彙", score: 85.0 },
      { testId: test1.id, category: "発音", score: 86.0 },

      // Test 2 (A2)
      { testId: test2.id, category: "流暢さ", score: 60.0 },
      { testId: test2.id, category: "やりとり力", score: 70.0 },
      { testId: test2.id, category: "文法", score: 65.0 },
      { testId: test2.id, category: "語彙", score: 68.0 },
      { testId: test2.id, category: "発音", score: 63.0 },

      // Test 3 (B2)
      { testId: test3.id, category: "流暢さ", score: 80.0 },
      { testId: test3.id, category: "やりとり力", score: 85.0 },
      { testId: test3.id, category: "文法", score: 80.0 },
      { testId: test3.id, category: "語彙", score: 82.0 },
      { testId: test3.id, category: "発音", score: 78.0 },

      // Test 4 (A1)
      { testId: test4.id, category: "流暢さ", score: 40.0 },
      { testId: test4.id, category: "やりとり力", score: 45.0 },
      { testId: test4.id, category: "文法", score: 42.0 },
      { testId: test4.id, category: "語彙", score: 44.0 },
      { testId: test4.id, category: "発音", score: 43.0 },

      // Test 5 (A2)
      { testId: test5.id, category: "流暢さ", score: 55.0 },
      { testId: test5.id, category: "やりとり力", score: 62.0 },
      { testId: test5.id, category: "文法", score: 58.0 },
      { testId: test5.id, category: "語彙", score: 60.0 },
      { testId: test5.id, category: "発音", score: 59.0 },

      // Test 6 (C1)
      { testId: test6.id, category: "流暢さ", score: 92.0 },
      { testId: test6.id, category: "やりとり力", score: 95.0 },
      { testId: test6.id, category: "文法", score: 88.0 },
      { testId: test6.id, category: "語彙", score: 93.0 },
      { testId: test6.id, category: "発音", score: 90.0 },
    ],
  });

  // 会話のターンを作成（詳細ページ用）
  console.log("Creating turns...");
  // Test 1のターン
  const turn1 = await prisma.turn.create({
    data: {
      testId: test1.id,
      turnNumber: 1,
      speaker: "EXAMINER",
      transcript: "Hello, what did you accomplish last week?",
      timestamp: new Date("2025-10-06T10:00:00Z"),
    },
  });

  const turn2 = await prisma.turn.create({
    data: {
      testId: test1.id,
      turnNumber: 2,
      speaker: "CANDIDATE",
      transcript: "I work very hard and finished project.",
      timestamp: new Date("2025-10-06T10:00:15Z"),
    },
  });

  const turn3 = await prisma.turn.create({
    data: {
      testId: test1.id,
      turnNumber: 3,
      speaker: "EXAMINER",
      transcript: "That sounds great! What kind of project was it?",
      timestamp: new Date("2025-10-06T10:00:30Z"),
    },
  });

  const turn4 = await prisma.turn.create({
    data: {
      testId: test1.id,
      turnNumber: 4,
      speaker: "CANDIDATE",
      transcript: "It was about marketing analysis for my company.",
      timestamp: new Date("2025-10-06T10:00:45Z"),
    },
  });

  // Test 2のターン
  const turn5 = await prisma.turn.create({
    data: {
      testId: test2.id,
      turnNumber: 1,
      speaker: "EXAMINER",
      transcript: "Can you tell me about your daily routine?",
      timestamp: new Date("2025-10-05T14:30:00Z"),
    },
  });

  const turn6 = await prisma.turn.create({
    data: {
      testId: test2.id,
      turnNumber: 2,
      speaker: "CANDIDATE",
      transcript: "I wake up at 7 o'clock and I go to work.",
      timestamp: new Date("2025-10-05T14:30:15Z"),
    },
  });

  // Test 3のターン
  const turn7 = await prisma.turn.create({
    data: {
      testId: test3.id,
      turnNumber: 1,
      speaker: "EXAMINER",
      transcript: "Have you traveled anywhere interesting recently?",
      timestamp: new Date("2025-10-04T16:45:00Z"),
    },
  });

  const turn8 = await prisma.turn.create({
    data: {
      testId: test3.id,
      turnNumber: 2,
      speaker: "CANDIDATE",
      transcript:
        "Yes, I visited Tokyo last month. It was an incredible experience with amazing food and culture.",
      timestamp: new Date("2025-10-04T16:45:15Z"),
    },
  });

  // 言い換え提案を作成（テストに対して）
  console.log("Creating paraphrases...");
  await prisma.paraphrase.create({
    data: {
      testId: test1.id,
      original: "I work very hard",
      suggestion: "I worked very hard",
    },
  });

  await prisma.paraphrase.create({
    data: {
      testId: test1.id,
      original: "finished project",
      suggestion: "completed my project successfully",
    },
  });

  await prisma.paraphrase.create({
    data: {
      testId: test2.id,
      original: "I go to work",
      suggestion: "I go to the office",
    },
  });

  await prisma.paraphrase.create({
    data: {
      testId: test3.id,
      original: "amazing food",
      suggestion: "delicious cuisine",
    },
  });

  // フィードバックを作成（全てのテストに対して）
  console.log("Creating feedback...");
  await prisma.feedback.create({
    data: {
      testId: test1.id,
      problematicPoints:
        "主に時制の一致と動詞の活用に課題があります。過去の出来事を話す際に現在形を使用する傾向があります。",
      strengths:
        "日常会話に必要な語彙力と応答力があります。相手の質問を理解し、適切な長さで答えることができています。",
      nextSteps:
        "基本的な動詞の過去形を定着させる練習をしてください。また、時制を意識した文章作成練習も有効です。",
    },
  });

  await prisma.feedback.create({
    data: {
      testId: test2.id,
      problematicPoints:
        "語彙が限定的で、同じ表現を繰り返し使用する傾向があります。",
      strengths:
        "基本的な文構造は理解しており、簡単な質問には答えることができます。",
      nextSteps:
        "日常的な場面での語彙を増やし、同義語を学習することをお勧めします。",
    },
  });

  await prisma.feedback.create({
    data: {
      testId: test3.id,
      problematicPoints:
        "特に大きな問題は見られませんが、より複雑な文構造にチャレンジできます。",
      strengths:
        "流暢で自然な会話ができており、豊富な語彙を適切に使用しています。",
      nextSteps:
        "C1レベルに向けて、より抽象的なトピックでの議論練習をお勧めします。",
    },
  });

  await prisma.feedback.create({
    data: {
      testId: test4.id,
      problematicPoints:
        "非常に基本的な表現のみで、文法的な誤りが多く見られます。",
      strengths: "簡単な挨拶や自己紹介はできており、学習意欲があります。",
      nextSteps:
        "基本的な文法構造（be動詞、一般動詞）から学習を始めることをお勧めします。",
    },
  });

  await prisma.feedback.create({
    data: {
      testId: test5.id,
      problematicPoints:
        "複雑な文章の構築が困難で、単語をつなげた表現が多いです。",
      strengths: "家族や趣味について基本的な情報を伝えることができます。",
      nextSteps: "文法の基礎を固めながら、語彙力の向上に取り組んでください。",
    },
  });

  await prisma.feedback.create({
    data: {
      testId: test6.id,
      problematicPoints:
        "ほとんど問題はありませんが、さらに高度な議論スキルを身につけることができます。",
      strengths:
        "複雑で抽象的なトピックについて詳細に議論でき、高度な語彙を効果的に使用しています。",
      nextSteps:
        "C2レベルに向けて、学術的な議論や専門分野でのプレゼンテーション練習をお勧めします。",
    },
  });

  // 語彙カードを作成（各テストに複数作成）
  console.log("Creating vocabulary cards...");
  await prisma.vocabularyCard.create({
    data: {
      testId: test1.id,
      word: "productive",
      cefrLevel: "B2",
      meaning: "生産的な、実りある",
      usage: "That was a very productive meeting.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test1.id,
      word: "accomplish",
      cefrLevel: "B1",
      meaning: "達成する、成し遂げる",
      usage: "I want to accomplish my goals this year.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test2.id,
      word: "routine",
      cefrLevel: "A2",
      meaning: "日課、ルーティン",
      usage: "My morning routine includes exercise.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test3.id,
      word: "incredible",
      cefrLevel: "B1",
      meaning: "信じられない、素晴らしい",
      usage: "The view from the mountain was incredible.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test3.id,
      word: "culture",
      cefrLevel: "B1",
      meaning: "文化",
      usage: "Japanese culture is very interesting.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test4.id,
      word: "basic",
      cefrLevel: "A1",
      meaning: "基本的な",
      usage: "These are basic English words.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test5.id,
      word: "family",
      cefrLevel: "A1",
      meaning: "家族",
      usage: "I love my family very much.",
    },
  });

  await prisma.vocabularyCard.create({
    data: {
      testId: test6.id,
      word: "sophisticated",
      cefrLevel: "C1",
      meaning: "洗練された、高度な",
      usage: "She has a very sophisticated approach to problem-solving.",
    },
  });

  // 評価詳細を作成（複数のテストに対して）
  console.log("Creating evaluation details...");
  await prisma.evaluationDetail.create({
    data: {
      testId: test1.id,
      category: "文法",
      turnNumber: 2,
      transcript: "I work very hard",
      reason: "過去の出来事なので過去形 'worked' を使用すべきです。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test1.id,
      category: "語彙",
      turnNumber: 4,
      transcript: "marketing analysis",
      reason:
        "適切な専門用語を使用しており、B1レベルに相応しい語彙力を示しています。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test2.id,
      category: "流暢さ",
      turnNumber: 2,
      transcript: "I wake up at 7 o'clock and I go to work",
      reason:
        "基本的な文構造で話しているが、もう少し詳細があると良いでしょう。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test3.id,
      category: "発音",
      turnNumber: 2,
      transcript: "incredible experience",
      reason: "複雑な語彙を正確に発音できており、優秀です。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test3.id,
      category: "やりとり力",
      turnNumber: 2,
      transcript: "Yes, I visited Tokyo last month",
      reason: "質問に対して適切に応答し、追加情報を提供できています。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test4.id,
      category: "文法",
      turnNumber: 1,
      transcript: "Basic sentence structure",
      reason: "基本的な文法構造の理解が必要です。",
    },
  });

  await prisma.evaluationDetail.create({
    data: {
      testId: test6.id,
      category: "語彙",
      turnNumber: 1,
      transcript: "sophisticated vocabulary usage",
      reason:
        "高度で適切な語彙を効果的に使用しており、C1レベルに相応しいです。",
    },
  });

  console.log(
    "✅ 全てのテーブルに満遍なくシードデータが正常に挿入されました！"
  );
  console.log("作成されたデータ:");
  console.log("- ユーザー: 3名");
  console.log("- OTP: 2件");
  console.log("- テスト: 6件");
  console.log("- ターン: 8件");
  console.log("- スコア: 30件 (6テスト × 5カテゴリ)");
  console.log("- フィードバック: 6件");
  console.log("- 語彙カード: 8件");
  console.log("- 言い換え提案: 4件");
  console.log("- 評価詳細: 7件");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
