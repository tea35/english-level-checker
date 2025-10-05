// src/app/api/graphql/route.ts

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { gql } from "graphql-tag";

const prisma = new PrismaClient();

// GraphQLスキーマの定義
const typeDefs = gql`
  type User {
    id: String
    email: String
    name: String
  }

  type Test {
    id: String
    userId: String
    cefrLevel: String
    totalScore: Float
    quality: String
    wordCount: Int
    summary: String
  }

  type Query {
    users: [User]
    tests: [Test]
  }
`;

// リゾルバ（データの取得や操作を行う関数）の定義
const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    tests: async () => {
      return await prisma.test.findMany();
    },
  },
};

// Apollo Serverのインスタンスを作成
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Next.jsのRoute Handlerとしてサーバーを起動
const handler = startServerAndCreateNextHandler(server);

// GETとPOSTリクエストをハンドリング
export { handler as GET, handler as POST };
