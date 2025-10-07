import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  // 全ユーザー取得
  static async getUsers() {
    return await prisma.user.findMany();
  }

  // ユーザー作成
  static async createUser(data: { email: string; name?: string }) {
    return await prisma.user.create({
      data,
    });
  }

  // ユーザー取得
  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  // ユーザー更新
  static async updateUser(id: number, data: { email?: string; name?: string }) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // ユーザー削除
  static async deleteUser(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    await prisma.user.delete({
      where: { id },
    });

    return { id, message: "User deleted successfully" };
  }
}
