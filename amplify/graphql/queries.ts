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
    seasonId
    seasonName
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
    seasonId
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMatchRecordQueryVariables,
  APITypes.GetMatchRecordQuery
>;
export const getSeason = /* GraphQL */ `query GetSeason($id: ID!) {
  getSeason(id: $id) {
    createdAt
    endDate
    id
    name
    startDate
    templates
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSeasonQueryVariables, APITypes.GetSeasonQuery>;
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
      seasonId
      seasonName
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
export const listAggregatedStatsBySeasonIdAndStatsTypeAndStatsKey = /* GraphQL */ `query ListAggregatedStatsBySeasonIdAndStatsTypeAndStatsKey(
  $filter: ModelAggregatedStatsFilterInput
  $limit: Int
  $nextToken: String
  $seasonId: ID!
  $sortDirection: ModelSortDirection
  $statsTypeStatsKey: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyConditionInput
) {
  listAggregatedStatsBySeasonIdAndStatsTypeAndStatsKey(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    seasonId: $seasonId
    sortDirection: $sortDirection
    statsTypeStatsKey: $statsTypeStatsKey
  ) {
    items {
      createdAt
      id
      losses
      metadata
      seasonId
      seasonName
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
  APITypes.ListAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyQueryVariables,
  APITypes.ListAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyQuery
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
export const listMatchRecordBySeasonId = /* GraphQL */ `query ListMatchRecordBySeasonId(
  $filter: ModelMatchRecordFilterInput
  $limit: Int
  $nextToken: String
  $seasonId: ID!
  $sortDirection: ModelSortDirection
) {
  listMatchRecordBySeasonId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    seasonId: $seasonId
    sortDirection: $sortDirection
  ) {
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
      seasonId
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMatchRecordBySeasonIdQueryVariables,
  APITypes.ListMatchRecordBySeasonIdQuery
>;
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
      seasonId
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
export const listSeasons = /* GraphQL */ `query ListSeasons(
  $filter: ModelSeasonFilterInput
  $limit: Int
  $nextToken: String
) {
  listSeasons(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      endDate
      id
      name
      startDate
      templates
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSeasonsQueryVariables,
  APITypes.ListSeasonsQuery
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
