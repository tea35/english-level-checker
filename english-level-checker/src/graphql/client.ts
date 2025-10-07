export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors[0]?.message || "GraphQLエラーが発生しました");
  }

  if (!result.data) {
    throw new Error("データが取得できませんでした");
  }

  return result.data;
}

// 型定義
export interface TestListItem {
  id: number;
  dateTime: string;
  level: string;
  score: string;
  totalScore: number;
  wordCount: number;
  createdAt: string;
}

export interface TestsResponse {
  tests: TestListItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TestDetail {
  id: number;
  cefrLevel: string;
  totalScore: number;
  quality: string;
  wordCount: number;
  summary: string;
  createdAt: string;
  scores: Array<{
    category: string;
    score: number;
  }>;
  turns: Array<{
    id: number;
    turnNumber: number;
    speaker: string;
    transcript: string;
    timestamp: string;
  }>;
  paraphrases: Array<{
    original: string;
    suggestion: string;
  }>;
  feedback: Array<{
    problematicPoints: string;
    strengths: string;
    nextSteps: string;
  }>;
  vocabularyCards: Array<{
    word: string;
    cefrLevel: string;
    meaning: string;
    usage: string;
  }>;
  evaluationDetails: Array<{
    category: string;
    turnNumber: number;
    transcript: string;
    reason: string;
  }>;
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// テスト一覧取得
export async function getTests(
  userId?: number,
  page: number = 1,
  limit: number = 10
): Promise<TestsResponse> {
  const query = `
    query GetTests($userId: Int, $page: Int, $limit: Int) {
      tests(userId: $userId, page: $page, limit: $limit) {
        tests {
          id
          dateTime
          level
          score
          totalScore
          wordCount
          createdAt
        }
        pagination {
          page
          limit
          totalCount
          totalPages
          hasNext
          hasPrev
        }
      }
    }
  `;

  const result = await graphqlRequest<{ tests: TestsResponse }>(query, {
    userId,
    page,
    limit,
  });

  return result.tests;
}

// 個別テスト詳細取得
export async function getTest(id: number): Promise<TestDetail> {
  const query = `
    query GetTest($id: Int!) {
      test(id: $id) {
        id
        cefrLevel
        totalScore
        quality
        wordCount
        summary
        createdAt
        scores {
          category
          score
        }
        turns {
          id
          turnNumber
          speaker
          transcript
          timestamp
        }
        paraphrases {
          original
          suggestion
        }
        feedback {
          problematicPoints
          strengths
          nextSteps
        }
        vocabularyCards {
          word
          cefrLevel
          meaning
          usage
        }
        evaluationDetails {
          category
          turnNumber
          transcript
          reason
        }
      }
    }
  `;

  const result = await graphqlRequest<{ test: TestDetail }>(query, { id });

  if (!result.test) {
    throw new Error("テストデータが見つかりません");
  }

  return result.test;
}

// ユーザー一覧取得
export async function getUsers(): Promise<User[]> {
  const query = `
    query GetUsers {
      users {
        id
        email
        name
        createdAt
        updatedAt
      }
    }
  `;

  const result = await graphqlRequest<{ users: User[] }>(query);
  return result.users;
}

// テスト作成用の型定義
export interface CreateTestInput {
  userId: number;
  cefrLevel: string;
  totalScore: number;
  quality: string;
  wordCount: number;
  summary?: string;
  turns: Array<{
    turnNumber: number;
    speaker: string;
    transcript: string;
    timestamp: string;
  }>;
  paraphrases: Array<{
    original: string;
    suggestion: string;
  }>;
  scores: Array<{
    category: string;
    score: number;
  }>;
  feedback?: {
    problematicPoints?: string;
    strengths?: string;
    nextSteps?: string;
  };
  vocabularyCards: Array<{
    word: string;
    cefrLevel: string;
    meaning: string;
    usage: string;
  }>;
  evaluationDetails: Array<{
    category: string;
    turnNumber: number;
    transcript: string;
    reason: string;
  }>;
}

// テスト作成
export async function createTest(input: CreateTestInput): Promise<TestDetail> {
  const query = `
    mutation CreateTest($input: CreateTestInput!) {
      createTest(input: $input) {
        id
        cefrLevel
        totalScore
        quality
        wordCount
        summary
        createdAt
        scores {
          category
          score
        }
        turns {
          id
          turnNumber
          speaker
          transcript
          timestamp
        }
        paraphrases {
          original
          suggestion
        }
        feedback {
          problematicPoints
          strengths
          nextSteps
        }
        vocabularyCards {
          word
          cefrLevel
          meaning
          usage
        }
        evaluationDetails {
          category
          turnNumber
          transcript
          reason
        }
      }
    }
  `;

  const result = await graphqlRequest<{ createTest: TestDetail }>(query, {
    input,
  });

  return result.createTest;
}

// 会話分析結果のレスポンス型
export interface ConversationAnalysisResponse {
  success: boolean;
  testId: number;
  data: TestDetail;
}

// 会話分析API呼び出し
export async function analyzeConversation(
  conversationId: string,
  userId: number,
  conversationMessages?: Array<{
    turnNumber: number;
    speaker: string;
    text: string;
    timestamp: string;
  }>
): Promise<ConversationAnalysisResponse> {
  const response = await fetch("/api/analyze-conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId,
      userId,
      conversationMessages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.details || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}
