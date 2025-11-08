import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Shadowverse Worlds Beyond Match Tracker - Data Schema
 *
 * このスキーマは以下のモデルを定義します：
 * - User: ユーザー情報（Cognitoと連携）
 * - Deck: ユーザーが登録したデッキ
 * - MatchRecord: 対戦記録
 * - AggregatedStats: 全体統計データ（集計結果）
 */

const schema = a.schema({
  /**
   * User モデル
   * Cognitoユーザーと1:1で対応
   */
  User: a
    .model({
      email: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  /**
   * Deck モデル
   * ユーザーが登録したデッキ情報
   */
  Deck: a
    .model({
      userId: a.id().required(),
      className: a.string().required(), // エルフ、ロイヤル、ウィッチ、ドラゴン、ナイトメア、ビショップ、ネメシス
      deckName: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  /**
   * MatchRecord モデル
   * 対戦記録
   */
  MatchRecord: a
    .model({
      userId: a.id().required(),
      myDeckId: a.id().required(),
      opponentClass: a.string().required(),
      opponentDeckType: a.string().required(),
      isFirstPlayer: a.boolean().required(),
      isWin: a.boolean().required(),
      recordedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.owner()]),

  /**
   * AggregatedStats モデル
   * 全ユーザーの集計データ（Lambda関数で更新）
   *
   * statsType: "class" | "deck" | "matchup" | "turnOrder"
   * statsKey: クラス名、デッキ名、マッチアップ組み合わせなど
   */
  AggregatedStats: a
    .model({
      statsType: a.string().required(),
      statsKey: a.string().required(),
      totalGames: a.integer().required(),
      wins: a.integer().required(),
      losses: a.integer().required(),
      winRate: a.float().required(),
      metadata: a.json(), // 追加情報（先攻/後攻の内訳など）
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]), // 未認証ユーザーでも読み取り可
      allow.authenticated().to(["read"]), // 認証済みユーザーも読み取り可
      allow.owner(), // Lambda関数（IAM）が更新
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/**
 * フロントエンドでの使用例:
 *
 * import { generateClient } from "aws-amplify/data";
 * import type { Schema } from "@/amplify/data/resource";
 *
 * const client = generateClient<Schema>();
 *
 * // デッキ一覧を取得
 * const { data: decks } = await client.models.Deck.list();
 *
 * // デッキを作成
 * await client.models.Deck.create({
 *   className: "エルフ",
 *   deckName: "リノエルフ",
 * });
 *
 * // 対戦記録を作成
 * await client.models.MatchRecord.create({
 *   myDeckId: deckId,
 *   opponentClass: "ロイヤル",
 *   opponentDeckType: "財宝ロイヤル",
 *   isFirstPlayer: true,
 *   isWin: true,
 *   recordedAt: new Date().toISOString(),
 * });
 *
 * // 統計データを取得（未認証でもOK）
 * const { data: classStats } = await client.models.AggregatedStats.list({
 *   filter: { statsType: { eq: "class" } }
 * });
 */
