import { gql } from "graphql-tag";

export const testTypeDefs = gql`
  type Score {
    id: Int!
    category: String!
    score: Float!
  }

  type Turn {
    id: Int!
    turnNumber: Int!
    speaker: String!
    transcript: String!
    timestamp: String!
  }

  type Paraphrase {
    id: Int!
    original: String!
    suggestion: String!
  }

  type Feedback {
    id: Int!
    problematicPoints: String
    strengths: String
    nextSteps: String
  }

  type VocabularyCard {
    id: Int!
    word: String!
    cefrLevel: String!
    meaning: String!
    usage: String!
  }

  type EvaluationDetail {
    id: Int!
    category: String!
    turnNumber: Int!
    transcript: String!
    reason: String!
  }

  type Test {
    id: Int!
    userId: Int!
    cefrLevel: String!
    totalScore: Float!
    quality: String!
    wordCount: Int!
    summary: String
    createdAt: String!
    scores: [Score!]!
    turns: [Turn!]!
    feedback: [Feedback!]!
    vocabularyCards: [VocabularyCard!]!
    evaluationDetails: [EvaluationDetail!]!
    paraphrases: [Paraphrase!]!
  }

  type TestListItem {
    id: Int!
    dateTime: String!
    level: String!
    score: String!
    totalScore: Float!
    wordCount: Int!
    createdAt: String!
    scores: [Score!]!
  }

  type TestsResponse {
    tests: [TestListItem!]!
    pagination: PaginationInfo!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    totalCount: Int!
    totalPages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  type DeleteResponse {
    id: Int!
    message: String!
  }

  input CreateTestInput {
    userId: Int!
    cefrLevel: String!
    totalScore: Float!
    quality: String!
    wordCount: Int!
    summary: String
    turns: [CreateTurnInput!]!
    scores: [CreateScoreInput!]!
    feedback: CreateFeedbackInput
    vocabularyCards: [CreateVocabularyCardInput!]!
    evaluationDetails: [CreateEvaluationDetailInput!]!
    paraphrases: [CreateParaphraseInput!]!
  }

  input CreateTurnInput {
    turnNumber: Int!
    speaker: String!
    transcript: String!
    timestamp: String!
  }

  input CreateScoreInput {
    category: String!
    score: Float!
  }

  input CreateFeedbackInput {
    problematicPoints: String
    strengths: String
    nextSteps: String
  }

  input CreateVocabularyCardInput {
    word: String!
    cefrLevel: String!
    meaning: String!
    usage: String!
  }

  input CreateEvaluationDetailInput {
    category: String!
    turnNumber: Int!
    transcript: String!
    reason: String!
  }

  input CreateParaphraseInput {
    original: String!
    suggestion: String!
  }

  extend type Query {
    tests(userId: Int, page: Int = 1, limit: Int = 10): TestsResponse!
    test(id: Int!): Test
  }

  extend type Mutation {
    createTest(input: CreateTestInput!): Test!
    deleteTest(id: Int!): DeleteResponse!
  }
`;
