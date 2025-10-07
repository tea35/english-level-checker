import { TestService } from "../../services/test_service";

export const testResolvers = {
  Query: {
    // テスト一覧取得（履歴ページ用）
    tests: async (
      _: any,
      args: { userId?: number; page?: number; limit?: number }
    ) => {
      return await TestService.getTests(args);
    },

    // 個別テスト取得（詳細ページ用）
    test: async (_: any, args: { id: number }) => {
      return await TestService.getTestById(args.id);
    },
  },

  Mutation: {
    // テスト作成（ElevenLabsのWebhook用）
    createTest: async (_: any, args: { input: any }) => {
      return await TestService.createTest(args.input);
    },

    // テスト削除
    deleteTest: async (_: any, args: { id: number }) => {
      return await TestService.deleteTest(args.id);
    },
  },
};
