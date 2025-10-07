import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    name: String
  }

  input UpdateUserInput {
    email: String
    name: String
  }

  extend type Query {
    users: [User!]!
    user(id: Int!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): DeleteResponse!
  }
`;
