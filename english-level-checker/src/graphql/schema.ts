import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { baseTypeDefs } from "./schemas/base_schema";
import { userTypeDefs } from "./schemas/user_schema";
import { testTypeDefs } from "./schemas/test_schema";
import { userResolvers } from "./resolvers/user_resolvers";
import { testResolvers } from "./resolvers/test_resolvers";

// スキーマを統合
export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  testTypeDefs,
]);

// リゾルバーを統合
export const resolvers = mergeResolvers([userResolvers, testResolvers]);
