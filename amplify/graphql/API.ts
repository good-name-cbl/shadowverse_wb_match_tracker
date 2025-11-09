/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AggregatedStats = {
  __typename: "AggregatedStats",
  createdAt: string,
  id: string,
  losses: number,
  metadata?: string | null,
  seasonId: string,
  seasonName: string,
  statsKey: string,
  statsType: string,
  totalGames: number,
  updatedAt?: string | null,
  winRate: number,
  wins: number,
};

export type Deck = {
  __typename: "Deck",
  className: string,
  createdAt?: string | null,
  deckName: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
  userId: string,
};

export type MatchRecord = {
  __typename: "MatchRecord",
  createdAt: string,
  id: string,
  isFirstPlayer: boolean,
  isWin: boolean,
  myDeckId: string,
  opponentClass: string,
  opponentDeckType: string,
  owner?: string | null,
  recordedAt: string,
  seasonId: string,
  updatedAt: string,
  userId: string,
};

export type Season = {
  __typename: "Season",
  createdAt: string,
  endDate?: string | null,
  id: string,
  name: string,
  startDate?: string | null,
  templates?: string | null,
  updatedAt: string,
};

export type User = {
  __typename: "User",
  createdAt?: string | null,
  email: string,
  id: string,
  owner?: string | null,
  updatedAt: string,
};

export type ModelAggregatedStatsFilterInput = {
  and?: Array< ModelAggregatedStatsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  losses?: ModelIntInput | null,
  metadata?: ModelStringInput | null,
  not?: ModelAggregatedStatsFilterInput | null,
  or?: Array< ModelAggregatedStatsFilterInput | null > | null,
  seasonId?: ModelIDInput | null,
  seasonName?: ModelStringInput | null,
  statsKey?: ModelStringInput | null,
  statsType?: ModelStringInput | null,
  totalGames?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  winRate?: ModelFloatInput | null,
  wins?: ModelIntInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelAggregatedStatsConnection = {
  __typename: "ModelAggregatedStatsConnection",
  items:  Array<AggregatedStats | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyConditionInput = {
  beginsWith?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
  between?: Array< ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null > | null,
  eq?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
  ge?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
  gt?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
  le?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
  lt?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput | null,
};

export type ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyInput = {
  statsKey?: string | null,
  statsType?: string | null,
};

export type ModelDeckFilterInput = {
  and?: Array< ModelDeckFilterInput | null > | null,
  className?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  deckName?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelDeckFilterInput | null,
  or?: Array< ModelDeckFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type ModelDeckConnection = {
  __typename: "ModelDeckConnection",
  items:  Array<Deck | null >,
  nextToken?: string | null,
};

export type ModelMatchRecordFilterInput = {
  and?: Array< ModelMatchRecordFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isFirstPlayer?: ModelBooleanInput | null,
  isWin?: ModelBooleanInput | null,
  myDeckId?: ModelIDInput | null,
  not?: ModelMatchRecordFilterInput | null,
  opponentClass?: ModelStringInput | null,
  opponentDeckType?: ModelStringInput | null,
  or?: Array< ModelMatchRecordFilterInput | null > | null,
  owner?: ModelStringInput | null,
  recordedAt?: ModelStringInput | null,
  seasonId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelMatchRecordConnection = {
  __typename: "ModelMatchRecordConnection",
  items:  Array<MatchRecord | null >,
  nextToken?: string | null,
};

export type ModelSeasonFilterInput = {
  and?: Array< ModelSeasonFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelSeasonFilterInput | null,
  or?: Array< ModelSeasonFilterInput | null > | null,
  startDate?: ModelStringInput | null,
  templates?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSeasonConnection = {
  __typename: "ModelSeasonConnection",
  items:  Array<Season | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelAggregatedStatsConditionInput = {
  and?: Array< ModelAggregatedStatsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  losses?: ModelIntInput | null,
  metadata?: ModelStringInput | null,
  not?: ModelAggregatedStatsConditionInput | null,
  or?: Array< ModelAggregatedStatsConditionInput | null > | null,
  seasonId?: ModelIDInput | null,
  seasonName?: ModelStringInput | null,
  statsKey?: ModelStringInput | null,
  statsType?: ModelStringInput | null,
  totalGames?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  winRate?: ModelFloatInput | null,
  wins?: ModelIntInput | null,
};

export type CreateAggregatedStatsInput = {
  id?: string | null,
  losses: number,
  metadata?: string | null,
  seasonId: string,
  seasonName: string,
  statsKey: string,
  statsType: string,
  totalGames: number,
  updatedAt?: string | null,
  winRate: number,
  wins: number,
};

export type ModelDeckConditionInput = {
  and?: Array< ModelDeckConditionInput | null > | null,
  className?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  deckName?: ModelStringInput | null,
  not?: ModelDeckConditionInput | null,
  or?: Array< ModelDeckConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type CreateDeckInput = {
  className: string,
  createdAt?: string | null,
  deckName: string,
  id?: string | null,
  userId: string,
};

export type ModelMatchRecordConditionInput = {
  and?: Array< ModelMatchRecordConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isFirstPlayer?: ModelBooleanInput | null,
  isWin?: ModelBooleanInput | null,
  myDeckId?: ModelIDInput | null,
  not?: ModelMatchRecordConditionInput | null,
  opponentClass?: ModelStringInput | null,
  opponentDeckType?: ModelStringInput | null,
  or?: Array< ModelMatchRecordConditionInput | null > | null,
  owner?: ModelStringInput | null,
  recordedAt?: ModelStringInput | null,
  seasonId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type CreateMatchRecordInput = {
  id?: string | null,
  isFirstPlayer: boolean,
  isWin: boolean,
  myDeckId: string,
  opponentClass: string,
  opponentDeckType: string,
  recordedAt: string,
  seasonId: string,
  userId: string,
};

export type ModelSeasonConditionInput = {
  and?: Array< ModelSeasonConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelSeasonConditionInput | null,
  or?: Array< ModelSeasonConditionInput | null > | null,
  startDate?: ModelStringInput | null,
  templates?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSeasonInput = {
  createdAt?: string | null,
  endDate?: string | null,
  id?: string | null,
  name: string,
  startDate?: string | null,
  templates?: string | null,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  createdAt?: string | null,
  email: string,
  id?: string | null,
};

export type DeleteAggregatedStatsInput = {
  id: string,
};

export type DeleteDeckInput = {
  id: string,
};

export type DeleteMatchRecordInput = {
  id: string,
};

export type DeleteSeasonInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type UpdateAggregatedStatsInput = {
  id: string,
  losses?: number | null,
  metadata?: string | null,
  seasonId?: string | null,
  seasonName?: string | null,
  statsKey?: string | null,
  statsType?: string | null,
  totalGames?: number | null,
  updatedAt?: string | null,
  winRate?: number | null,
  wins?: number | null,
};

export type UpdateDeckInput = {
  className?: string | null,
  createdAt?: string | null,
  deckName?: string | null,
  id: string,
  userId?: string | null,
};

export type UpdateMatchRecordInput = {
  id: string,
  isFirstPlayer?: boolean | null,
  isWin?: boolean | null,
  myDeckId?: string | null,
  opponentClass?: string | null,
  opponentDeckType?: string | null,
  recordedAt?: string | null,
  seasonId?: string | null,
  userId?: string | null,
};

export type UpdateSeasonInput = {
  createdAt?: string | null,
  endDate?: string | null,
  id: string,
  name?: string | null,
  startDate?: string | null,
  templates?: string | null,
};

export type UpdateUserInput = {
  createdAt?: string | null,
  email?: string | null,
  id: string,
};

export type ModelSubscriptionAggregatedStatsFilterInput = {
  and?: Array< ModelSubscriptionAggregatedStatsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  losses?: ModelSubscriptionIntInput | null,
  metadata?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAggregatedStatsFilterInput | null > | null,
  seasonId?: ModelSubscriptionIDInput | null,
  seasonName?: ModelSubscriptionStringInput | null,
  statsKey?: ModelSubscriptionStringInput | null,
  statsType?: ModelSubscriptionStringInput | null,
  totalGames?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  winRate?: ModelSubscriptionFloatInput | null,
  wins?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionDeckFilterInput = {
  and?: Array< ModelSubscriptionDeckFilterInput | null > | null,
  className?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  deckName?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionDeckFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionMatchRecordFilterInput = {
  and?: Array< ModelSubscriptionMatchRecordFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isFirstPlayer?: ModelSubscriptionBooleanInput | null,
  isWin?: ModelSubscriptionBooleanInput | null,
  myDeckId?: ModelSubscriptionIDInput | null,
  opponentClass?: ModelSubscriptionStringInput | null,
  opponentDeckType?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMatchRecordFilterInput | null > | null,
  owner?: ModelStringInput | null,
  recordedAt?: ModelSubscriptionStringInput | null,
  seasonId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionSeasonFilterInput = {
  and?: Array< ModelSubscriptionSeasonFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionSeasonFilterInput | null > | null,
  startDate?: ModelSubscriptionStringInput | null,
  templates?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetAggregatedStatsQueryVariables = {
  id: string,
};

export type GetAggregatedStatsQuery = {
  getAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type GetDeckQueryVariables = {
  id: string,
};

export type GetDeckQuery = {
  getDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetMatchRecordQueryVariables = {
  id: string,
};

export type GetMatchRecordQuery = {
  getMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetSeasonQueryVariables = {
  id: string,
};

export type GetSeasonQuery = {
  getSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type ListAggregatedStatsQueryVariables = {
  filter?: ModelAggregatedStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAggregatedStatsQuery = {
  listAggregatedStats?:  {
    __typename: "ModelAggregatedStatsConnection",
    items:  Array< {
      __typename: "AggregatedStats",
      createdAt: string,
      id: string,
      losses: number,
      metadata?: string | null,
      seasonId: string,
      seasonName: string,
      statsKey: string,
      statsType: string,
      totalGames: number,
      updatedAt?: string | null,
      winRate: number,
      wins: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyQueryVariables = {
  filter?: ModelAggregatedStatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  seasonId: string,
  sortDirection?: ModelSortDirection | null,
  statsTypeStatsKey?: ModelAggregatedStatsAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyCompositeKeyConditionInput | null,
};

export type ListAggregatedStatsBySeasonIdAndStatsTypeAndStatsKeyQuery = {
  listAggregatedStatsBySeasonIdAndStatsTypeAndStatsKey?:  {
    __typename: "ModelAggregatedStatsConnection",
    items:  Array< {
      __typename: "AggregatedStats",
      createdAt: string,
      id: string,
      losses: number,
      metadata?: string | null,
      seasonId: string,
      seasonName: string,
      statsKey: string,
      statsType: string,
      totalGames: number,
      updatedAt?: string | null,
      winRate: number,
      wins: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDecksQueryVariables = {
  filter?: ModelDeckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDecksQuery = {
  listDecks?:  {
    __typename: "ModelDeckConnection",
    items:  Array< {
      __typename: "Deck",
      className: string,
      createdAt?: string | null,
      deckName: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMatchRecordBySeasonIdQueryVariables = {
  filter?: ModelMatchRecordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  seasonId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListMatchRecordBySeasonIdQuery = {
  listMatchRecordBySeasonId?:  {
    __typename: "ModelMatchRecordConnection",
    items:  Array< {
      __typename: "MatchRecord",
      createdAt: string,
      id: string,
      isFirstPlayer: boolean,
      isWin: boolean,
      myDeckId: string,
      opponentClass: string,
      opponentDeckType: string,
      owner?: string | null,
      recordedAt: string,
      seasonId: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMatchRecordsQueryVariables = {
  filter?: ModelMatchRecordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMatchRecordsQuery = {
  listMatchRecords?:  {
    __typename: "ModelMatchRecordConnection",
    items:  Array< {
      __typename: "MatchRecord",
      createdAt: string,
      id: string,
      isFirstPlayer: boolean,
      isWin: boolean,
      myDeckId: string,
      opponentClass: string,
      opponentDeckType: string,
      owner?: string | null,
      recordedAt: string,
      seasonId: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSeasonsQueryVariables = {
  filter?: ModelSeasonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSeasonsQuery = {
  listSeasons?:  {
    __typename: "ModelSeasonConnection",
    items:  Array< {
      __typename: "Season",
      createdAt: string,
      endDate?: string | null,
      id: string,
      name: string,
      startDate?: string | null,
      templates?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      createdAt?: string | null,
      email: string,
      id: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAggregatedStatsMutationVariables = {
  condition?: ModelAggregatedStatsConditionInput | null,
  input: CreateAggregatedStatsInput,
};

export type CreateAggregatedStatsMutation = {
  createAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type CreateDeckMutationVariables = {
  condition?: ModelDeckConditionInput | null,
  input: CreateDeckInput,
};

export type CreateDeckMutation = {
  createDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreateMatchRecordMutationVariables = {
  condition?: ModelMatchRecordConditionInput | null,
  input: CreateMatchRecordInput,
};

export type CreateMatchRecordMutation = {
  createMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreateSeasonMutationVariables = {
  condition?: ModelSeasonConditionInput | null,
  input: CreateSeasonInput,
};

export type CreateSeasonMutation = {
  createSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteAggregatedStatsMutationVariables = {
  condition?: ModelAggregatedStatsConditionInput | null,
  input: DeleteAggregatedStatsInput,
};

export type DeleteAggregatedStatsMutation = {
  deleteAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type DeleteDeckMutationVariables = {
  condition?: ModelDeckConditionInput | null,
  input: DeleteDeckInput,
};

export type DeleteDeckMutation = {
  deleteDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteMatchRecordMutationVariables = {
  condition?: ModelMatchRecordConditionInput | null,
  input: DeleteMatchRecordInput,
};

export type DeleteMatchRecordMutation = {
  deleteMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteSeasonMutationVariables = {
  condition?: ModelSeasonConditionInput | null,
  input: DeleteSeasonInput,
};

export type DeleteSeasonMutation = {
  deleteSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAggregatedStatsMutationVariables = {
  condition?: ModelAggregatedStatsConditionInput | null,
  input: UpdateAggregatedStatsInput,
};

export type UpdateAggregatedStatsMutation = {
  updateAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type UpdateDeckMutationVariables = {
  condition?: ModelDeckConditionInput | null,
  input: UpdateDeckInput,
};

export type UpdateDeckMutation = {
  updateDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateMatchRecordMutationVariables = {
  condition?: ModelMatchRecordConditionInput | null,
  input: UpdateMatchRecordInput,
};

export type UpdateMatchRecordMutation = {
  updateMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateSeasonMutationVariables = {
  condition?: ModelSeasonConditionInput | null,
  input: UpdateSeasonInput,
};

export type UpdateSeasonMutation = {
  updateSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateAggregatedStatsSubscriptionVariables = {
  filter?: ModelSubscriptionAggregatedStatsFilterInput | null,
};

export type OnCreateAggregatedStatsSubscription = {
  onCreateAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type OnCreateDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
  owner?: string | null,
};

export type OnCreateDeckSubscription = {
  onCreateDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateMatchRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMatchRecordFilterInput | null,
  owner?: string | null,
};

export type OnCreateMatchRecordSubscription = {
  onCreateMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateSeasonSubscriptionVariables = {
  filter?: ModelSubscriptionSeasonFilterInput | null,
};

export type OnCreateSeasonSubscription = {
  onCreateSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAggregatedStatsSubscriptionVariables = {
  filter?: ModelSubscriptionAggregatedStatsFilterInput | null,
};

export type OnDeleteAggregatedStatsSubscription = {
  onDeleteAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type OnDeleteDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDeckSubscription = {
  onDeleteDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteMatchRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMatchRecordFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMatchRecordSubscription = {
  onDeleteMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteSeasonSubscriptionVariables = {
  filter?: ModelSubscriptionSeasonFilterInput | null,
};

export type OnDeleteSeasonSubscription = {
  onDeleteSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAggregatedStatsSubscriptionVariables = {
  filter?: ModelSubscriptionAggregatedStatsFilterInput | null,
};

export type OnUpdateAggregatedStatsSubscription = {
  onUpdateAggregatedStats?:  {
    __typename: "AggregatedStats",
    createdAt: string,
    id: string,
    losses: number,
    metadata?: string | null,
    seasonId: string,
    seasonName: string,
    statsKey: string,
    statsType: string,
    totalGames: number,
    updatedAt?: string | null,
    winRate: number,
    wins: number,
  } | null,
};

export type OnUpdateDeckSubscriptionVariables = {
  filter?: ModelSubscriptionDeckFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDeckSubscription = {
  onUpdateDeck?:  {
    __typename: "Deck",
    className: string,
    createdAt?: string | null,
    deckName: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateMatchRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMatchRecordFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMatchRecordSubscription = {
  onUpdateMatchRecord?:  {
    __typename: "MatchRecord",
    createdAt: string,
    id: string,
    isFirstPlayer: boolean,
    isWin: boolean,
    myDeckId: string,
    opponentClass: string,
    opponentDeckType: string,
    owner?: string | null,
    recordedAt: string,
    seasonId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateSeasonSubscriptionVariables = {
  filter?: ModelSubscriptionSeasonFilterInput | null,
};

export type OnUpdateSeasonSubscription = {
  onUpdateSeason?:  {
    __typename: "Season",
    createdAt: string,
    endDate?: string | null,
    id: string,
    name: string,
    startDate?: string | null,
    templates?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    createdAt?: string | null,
    email: string,
    id: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};
