/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAggregatedStats = /* GraphQL */ `mutation CreateAggregatedStats(
  $condition: ModelAggregatedStatsConditionInput
  $input: CreateAggregatedStatsInput!
) {
  createAggregatedStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAggregatedStatsMutationVariables,
  APITypes.CreateAggregatedStatsMutation
>;
export const createDeck = /* GraphQL */ `mutation CreateDeck(
  $condition: ModelDeckConditionInput
  $input: CreateDeckInput!
) {
  createDeck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDeckMutationVariables,
  APITypes.CreateDeckMutation
>;
export const createMatchRecord = /* GraphQL */ `mutation CreateMatchRecord(
  $condition: ModelMatchRecordConditionInput
  $input: CreateMatchRecordInput!
) {
  createMatchRecord(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMatchRecordMutationVariables,
  APITypes.CreateMatchRecordMutation
>;
export const createSeason = /* GraphQL */ `mutation CreateSeason(
  $condition: ModelSeasonConditionInput
  $input: CreateSeasonInput!
) {
  createSeason(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateSeasonMutationVariables,
  APITypes.CreateSeasonMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteAggregatedStats = /* GraphQL */ `mutation DeleteAggregatedStats(
  $condition: ModelAggregatedStatsConditionInput
  $input: DeleteAggregatedStatsInput!
) {
  deleteAggregatedStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAggregatedStatsMutationVariables,
  APITypes.DeleteAggregatedStatsMutation
>;
export const deleteDeck = /* GraphQL */ `mutation DeleteDeck(
  $condition: ModelDeckConditionInput
  $input: DeleteDeckInput!
) {
  deleteDeck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDeckMutationVariables,
  APITypes.DeleteDeckMutation
>;
export const deleteMatchRecord = /* GraphQL */ `mutation DeleteMatchRecord(
  $condition: ModelMatchRecordConditionInput
  $input: DeleteMatchRecordInput!
) {
  deleteMatchRecord(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMatchRecordMutationVariables,
  APITypes.DeleteMatchRecordMutation
>;
export const deleteSeason = /* GraphQL */ `mutation DeleteSeason(
  $condition: ModelSeasonConditionInput
  $input: DeleteSeasonInput!
) {
  deleteSeason(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteSeasonMutationVariables,
  APITypes.DeleteSeasonMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const updateAggregatedStats = /* GraphQL */ `mutation UpdateAggregatedStats(
  $condition: ModelAggregatedStatsConditionInput
  $input: UpdateAggregatedStatsInput!
) {
  updateAggregatedStats(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAggregatedStatsMutationVariables,
  APITypes.UpdateAggregatedStatsMutation
>;
export const updateDeck = /* GraphQL */ `mutation UpdateDeck(
  $condition: ModelDeckConditionInput
  $input: UpdateDeckInput!
) {
  updateDeck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDeckMutationVariables,
  APITypes.UpdateDeckMutation
>;
export const updateMatchRecord = /* GraphQL */ `mutation UpdateMatchRecord(
  $condition: ModelMatchRecordConditionInput
  $input: UpdateMatchRecordInput!
) {
  updateMatchRecord(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMatchRecordMutationVariables,
  APITypes.UpdateMatchRecordMutation
>;
export const updateSeason = /* GraphQL */ `mutation UpdateSeason(
  $condition: ModelSeasonConditionInput
  $input: UpdateSeasonInput!
) {
  updateSeason(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateSeasonMutationVariables,
  APITypes.UpdateSeasonMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
    createdAt
    email
    id
    owner
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
