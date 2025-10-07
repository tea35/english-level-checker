import { UserService } from "../../services/user_service";

export const userResolvers = {
  Query: {
    // 全ユーザー取得
    users: async () => {
      return await UserService.getUsers();
    },

    // 個別ユーザー取得
    user: async (_: any, args: { id: number }) => {
      return await UserService.getUserById(args.id);
    },
  },

  Mutation: {
    // ユーザー作成
    createUser: async (
      _: any,
      args: { input: { email: string; name?: string } }
    ) => {
      return await UserService.createUser(args.input);
    },

    // ユーザー更新
    updateUser: async (
      _: any,
      args: { id: number; input: { email?: string; name?: string } }
    ) => {
      return await UserService.updateUser(args.id, args.input);
    },

    // ユーザー削除
    deleteUser: async (_: any, args: { id: number }) => {
      return await UserService.deleteUser(args.id);
    },
  },
};
