import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface TestListParams {
  userId?: number;
  page?: number;
  limit?: number;
}

// 個別の型定義
export interface CreateTurnData {
  turnNumber: number;
  speaker: string;
  transcript: string;
  timestamp: string;
}

export interface CreateScoreData {
  category: string;
  score: number;
}

export interface CreateFeedbackData {
  strengths?: string;
  problematicPoints?: string;
  nextSteps?: string;
}

export interface CreateVocabularyCardData {
  word: string;
  cefrLevel: string;
  meaning: string;
  usage: string;
}

export interface CreateEvaluationDetailData {
  category: string;
  turnNumber: number;
  transcript: string;
  reason: string;
}

export interface CreateParaphraseData {
  original: string;
  suggestion: string;
}

export interface CreateTestData {
  userId: number;
  cefrLevel: string;
  totalScore: number;
  quality: string;
  wordCount: number;
  summary?: string;
  turns: CreateTurnData[];
  scores: CreateScoreData[];
  feedback?: CreateFeedbackData;
  vocabularyCards?: CreateVocabularyCardData[];
  evaluationDetails?: CreateEvaluationDetailData[];
  paraphrases?: CreateParaphraseData[];
}

export class TestService {
  // テスト一覧取得
  static async getTests(params: TestListParams) {
    const { userId, page = 1, limit = 10 } = params;

    // フィルタ条件を作成
    const where = userId ? { userId } : {};

    // 総件数を取得
    const totalCount = await prisma.test.count({ where });

    // ページネーション計算
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    // データを取得
    const tests = await prisma.test.findMany({
      where,
      include: {
        scores: true,
      },
      orderBy: { createdAt: "desc" }, // 新しい順
      skip,
      take: limit,
    });

    // 履歴ページ用のフォーマット
    const formattedTests = tests.map((test) => {
      // 日付フォーマット（2025年10月6日(月) 01:28）
      const date = new Date(test.createdAt);
      const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
      const formattedDate = `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日(${weekdays[date.getDay()]}) ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      return {
        id: test.id,
        dateTime: formattedDate,
        level: test.cefrLevel,
        score: `${Math.round(test.totalScore)}%`,
        totalScore: test.totalScore,
        wordCount: test.wordCount,
        createdAt: test.createdAt.toISOString(),
        scores: test.scores,
      };
    });

    return {
      tests: formattedTests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // 個別テスト詳細取得
  static async getTestById(id: number) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        scores: true,
        turns: {
          orderBy: { turnNumber: "asc" },
        },
        feedback: true,
        vocabularyCards: true,
        EvaluationDetail: true,
        paraphrases: true,
      },
    });

    if (!test) {
      throw new Error(`Test with id ${id} not found`);
    }

    return {
      ...test,
      createdAt: test.createdAt.toISOString(),
      turns:
        test.turns?.map((turn) => ({
          ...turn,
          timestamp: turn.timestamp.toISOString(),
        })) || [],
      evaluationDetails: test.EvaluationDetail || [],
    };
  }

  // テスト作成
  static async createTest(data: CreateTestData) {
    const test = await prisma.test.create({
      data: {
        userId: data.userId,
        cefrLevel: data.cefrLevel,
        totalScore: data.totalScore,
        quality: data.quality,
        wordCount: data.wordCount,
        summary: data.summary,

        // 関連データを同時作成
        scores: {
          create: data.scores,
        },

        turns: {
          create: data.turns.map((turn: CreateTurnData) => ({
            turnNumber: turn.turnNumber,
            speaker: turn.speaker,
            transcript: turn.transcript,
            timestamp: new Date(turn.timestamp),
          })),
        },

        feedback: data.feedback
          ? {
              create: data.feedback,
            }
          : undefined,

        vocabularyCards: {
          create: data.vocabularyCards || [],
        },

        paraphrases: {
          create: data.paraphrases || [],
        },
        EvaluationDetail: {
          create: data.evaluationDetails || [],
        },
      },
      include: {
        scores: true,
        turns: {
          orderBy: { turnNumber: "asc" },
        },
        feedback: true,
        vocabularyCards: true,
        EvaluationDetail: true,
        paraphrases: true,
      },
    });

    return {
      ...test,
      createdAt: test.createdAt.toISOString(),
      turns:
        test.turns?.map((turn) => ({
          ...turn,
          timestamp: turn.timestamp.toISOString(),
        })) || [],
      evaluationDetails: test.EvaluationDetail || [],
    };
  }

  // テスト削除
  static async deleteTest(id: number) {
    const test = await prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      throw new Error(`Test with id ${id} not found`);
    }

    await prisma.test.delete({
      where: { id },
    });

    return { id, message: "Test deleted successfully" };
  }
}
