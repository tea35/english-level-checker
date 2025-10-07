// src/app/api/graphql/route.ts

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "../../../graphql/schema";
import { NextRequest } from "next/server";

// Next.js App Routerでの動的処理を強制（Mutationのキャッシュを防ぐ）
export const dynamic = "force-dynamic";

// Apollo Serverのインスタンスを作成
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Next.jsのRoute Handlerとしてサーバーを起動
const handler = startServerAndCreateNextHandler(server);

// GETとPOSTリクエストをハンドリング
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
