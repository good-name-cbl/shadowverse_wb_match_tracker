/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAggregatedStats = /* GraphQL */ `query GetAggregatedStats($id: ID!) {
  getAggregatedStats(id: $id) {
    createdAt
    id
    losses
    metadata
    owner
    statsKey
    statsType
    totalGames
    updatedAt
    winRate
    wins
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAggregatedStatsQueryVariables,
  APITypes.GetAggregatedStatsQuery
>;
export const getDeck = /* GraphQL */ `query GetDeck($id: ID!) {
  getDeck(id: $id) {
    className
    createdAt
    deckName
    id
    owner
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDeckQueryVariables, APITypes.GetDeckQuery>;
export const getMatchRecord = /* GraphQL */ `query GetMatchRecord($id: ID!) {
  getMatchRecord(id: $id) {
    createdAt
    id
    isFirstPlayer
    isWin
    myDeckId
    opponentClass
    opponentDeckType
    owner
    recordedAt
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMatchRecordQueryVariables,
  APITypes.GetMatchRecordQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listAggregatedStats = /* GraphQL */ `query ListAggregatedStats(
  $filter: ModelAggregatedStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAggregatedStats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      losses
      metadata
      owner
      statsKey
      statsType
      totalGames
      updatedAt
      winRate
      wins
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAggregatedStatsQueryVariables,
  APITypes.ListAggregatedStatsQuery
>;
export const listDecks = /* GraphQL */ `query ListDecks(
  $filter: ModelDeckFilterInput
  $limit: Int
  $nextToken: String
) {
  listDecks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      className
      createdAt
      deckName
      id
      owner
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListDecksQueryVariables, APITypes.ListDecksQuery>;
export const listMatchRecords = /* GraphQL */ `query ListMatchRecords(
  $filter: ModelMatchRecordFilterInput
  $limit: Int
  $nextToken: String
) {
  listMatchRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      isFirstPlayer
      isWin
      myDeckId
      opponentClass
      opponentDeckType
      owner
      recordedAt
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMatchRecordsQueryVariables,
  APITypes.ListMatchRecordsQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      id
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
