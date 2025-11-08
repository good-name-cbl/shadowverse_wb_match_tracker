/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAggregatedStats = /* GraphQL */ `subscription OnCreateAggregatedStats(
  $filter: ModelSubscriptionAggregatedStatsFilterInput
  $owner: String
) {
  onCreateAggregatedStats(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAggregatedStatsSubscriptionVariables,
  APITypes.OnCreateAggregatedStatsSubscription
>;
export const onCreateDeck = /* GraphQL */ `subscription OnCreateDeck(
  $filter: ModelSubscriptionDeckFilterInput
  $owner: String
) {
  onCreateDeck(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDeckSubscriptionVariables,
  APITypes.OnCreateDeckSubscription
>;
export const onCreateMatchRecord = /* GraphQL */ `subscription OnCreateMatchRecord(
  $filter: ModelSubscriptionMatchRecordFilterInput
  $owner: String
) {
  onCreateMatchRecord(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMatchRecordSubscriptionVariables,
  APITypes.OnCreateMatchRecordSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onCreateUser(filter: $filter, owner: $owner) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteAggregatedStats = /* GraphQL */ `subscription OnDeleteAggregatedStats(
  $filter: ModelSubscriptionAggregatedStatsFilterInput
  $owner: String
) {
  onDeleteAggregatedStats(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAggregatedStatsSubscriptionVariables,
  APITypes.OnDeleteAggregatedStatsSubscription
>;
export const onDeleteDeck = /* GraphQL */ `subscription OnDeleteDeck(
  $filter: ModelSubscriptionDeckFilterInput
  $owner: String
) {
  onDeleteDeck(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDeckSubscriptionVariables,
  APITypes.OnDeleteDeckSubscription
>;
export const onDeleteMatchRecord = /* GraphQL */ `subscription OnDeleteMatchRecord(
  $filter: ModelSubscriptionMatchRecordFilterInput
  $owner: String
) {
  onDeleteMatchRecord(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMatchRecordSubscriptionVariables,
  APITypes.OnDeleteMatchRecordSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onDeleteUser(filter: $filter, owner: $owner) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateAggregatedStats = /* GraphQL */ `subscription OnUpdateAggregatedStats(
  $filter: ModelSubscriptionAggregatedStatsFilterInput
  $owner: String
) {
  onUpdateAggregatedStats(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAggregatedStatsSubscriptionVariables,
  APITypes.OnUpdateAggregatedStatsSubscription
>;
export const onUpdateDeck = /* GraphQL */ `subscription OnUpdateDeck(
  $filter: ModelSubscriptionDeckFilterInput
  $owner: String
) {
  onUpdateDeck(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDeckSubscriptionVariables,
  APITypes.OnUpdateDeckSubscription
>;
export const onUpdateMatchRecord = /* GraphQL */ `subscription OnUpdateMatchRecord(
  $filter: ModelSubscriptionMatchRecordFilterInput
  $owner: String
) {
  onUpdateMatchRecord(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMatchRecordSubscriptionVariables,
  APITypes.OnUpdateMatchRecordSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $owner: String
) {
  onUpdateUser(filter: $filter, owner: $owner) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
