# AWS移行＆全体統計機能 実装計画

**最終更新日**: 2025-11-09 00:45 JST

---

## 📋 プロジェクト概要

### 目的
- LocalStorageベースのアプリをAWS（Cognito + DynamoDB + AppSync）に移行
- 全ユーザーの対戦データを集計し、公開統計ページを提供

### 要件サマリー
- **認証**: Amazon Cognito
- **データストア**: DynamoDB + AppSync (GraphQL)
- **集計**: Lambda + EventBridge（1日1回バッチ）
- **統計公開**: 未認証ユーザーでも閲覧可能
- **既存データ**: LocalStorageからの移行ツールを提供

---

## 🎯 Phase別進捗

| Phase | タイトル | ステータス | 完了率 |
|-------|---------|-----------|--------|
| Phase 1 | AWS基盤構築 | ✅ 完了 | 4/4 (100%) |
| Phase 2 | 認証機能の実装 | ✅ 完了 | 2/2 (100%) |
| Phase 3 | 個人データのクラウド化 | ✅ 完了 | 2/3 (67%) |
| Phase 4 | 集計基盤の構築 | ⚠️ 部分完了 | 2/3 (67%) |
| Phase 5 | 全体統計機能の実装 | ✅ 完了 | 5/6 (83%) |
| Phase 6 | デプロイ＆運用 | ⚠️ 部分完了 | 1/3 (33%) |

**全体進捗**: 16/21 チケット完了 (76%)

---

## Phase 1: AWS基盤構築

### ✅ チケット #1.1: Amplify Gen2プロジェクトの初期設定
- [x] **ステータス**: ✅ 完了
- **目的**: AWS Amplify環境のセットアップ
- **タスク**:
  - [x] `amplify/backend.ts`の設定
  - [x] 環境変数の設定
  - [x] サンドボックス環境の動作確認
- **成果物**: `npx ampx sandbox`でローカル開発環境が起動できる状態
- **メモ**: 既にAmplifyアプリがデプロイ済み（App ID: d1750m4lxqo4gv）

---

### ✅ チケット #1.2: Amazon Cognito認証の設定
- [x] **ステータス**: ✅ 完了
- **目的**: ユーザー認証基盤の構築
- **タスク**:
  - [x] Cognitoユーザープールの設定
  - [x] メール認証の設定
  - [x] パスワードポリシーの設定
  - [x] サインアップ属性の定義（email必須）
- **成果物**: Cognitoユーザープールが作成され、認証可能な状態
- **メモ**:
  - User Pool ID: ap-northeast-1_Ft4l8rF4V
  - amplify/auth/resource.ts にアカウント復旧設定を追加

---

### ✅ チケット #1.3: DynamoDBスキーマ設計
- [x] **ステータス**: ✅ 完了
- **目的**: データモデルの設計
- **タスク**:
  - [x] Userテーブルの設計（Cognitoと連携）
  - [x] Deckテーブルの設計（userId外部キー）
  - [x] MatchRecordテーブルの設計（userId, deckId外部キー）
  - [x] AggregatedStatsテーブルの設計（集計データ用）
  - [x] GSI（Global Secondary Index）の設計（Amplify Data自動生成）
- **スキーマ設計**:
  ```
  User
  - id (PK)
  - email
  - createdAt

  Deck
  - id (PK)
  - userId (GSI)
  - className
  - deckName
  - createdAt

  MatchRecord
  - id (PK)
  - userId (GSI)
  - myDeckId (GSI)
  - opponentClass
  - opponentDeckType
  - isFirstPlayer
  - isWin
  - recordedAt

  AggregatedStats (集計データ)
  - statsType (PK: "class" | "deck" | "matchup" | "turnOrder")
  - statsKey (SK: クラス名、デッキ名など)
  - totalGames
  - wins
  - losses
  - winRate
  - metadata (JSON)
  - updatedAt
  ```
- **成果物**: スキーマ設計ドキュメント、`amplify/data/resource.ts`の定義
- **メモ**:
  - amplify/data/resource.ts を全面的に書き換え
  - Todoサンプルモデルを削除し、4つの新モデルを追加
  - 認証方式を userPool ベースに変更（owner()認証）
  - AggregatedStatsは guest() 読み取り可能に設定

---

### ✅ チケット #1.4: AppSync GraphQL APIの設計
- [x] **ステータス**: ✅ 完了
- **目的**: データアクセス用APIの構築
- **タスク**:
  - [x] GraphQLスキーマの定義
  - [x] 認証ルールの設定（owner-based access）
  - [x] リゾルバーの設定（Amplify Data自動生成）
  - [x] 型生成（`npx ampx generate`）
- **主要なQuery/Mutation**:
  ```graphql
  # Deck
  createDeck(className, deckName)
  listDecks(filter)
  deleteDeck(id)

  # MatchRecord
  createMatchRecord(input)
  listMatchRecords(filter)
  deleteMatchRecord(id)

  # AggregatedStats (読み取り専用、未認証OK)
  getClassStats
  getDeckStats
  getMatchupStats
  getTurnOrderStats
  ```
- **成果物**: GraphQL API定義、型生成完了
- **メモ**:
  - スキーマ定義完了（amplify/data/resource.ts）
  - サンドボックス起動して型生成を実行
  - amplify_outputs.json更新完了（新しいモデル情報を含む）
  - DynamoDBテーブル作成完了：
    - User-o2gjs6tev5edffdehy4gzte2mq-NONE
    - Deck-o2gjs6tev5edffdehy4gzte2mq-NONE
    - MatchRecord-o2gjs6tev5edffdehy4gzte2mq-NONE
    - AggregatedStats-o2gjs6tev5edffdehy4gzte2mq-NONE
  - AppSync GraphQL Endpoint: https://75t2ryipejfklhiaykstydukoq.appsync-api.ap-northeast-1.amazonaws.com/graphql

---

## Phase 2: 認証機能の実装

### ✅ チケット #2.1: AuthContextのCognito連携
- [x] **ステータス**: ✅ 完了
- **目的**: モック認証を実際のCognitoに置き換え
- **タスク**:
  - [x] `contexts/AuthContext.tsx`の書き換え
  - [x] `signIn`, `signUp`, `signOut`をAmplify Authに置き換え
  - [x] 認証状態の永続化（セッション管理）
  - [x] エラーハンドリングの実装
- **影響ファイル**: `contexts/AuthContext.tsx`, `app/layout.tsx`, `components/ConfigureAmplifyClientSide.tsx`
- **成果物**: Cognitoでサインアップ・ログインが可能
- **メモ**:
  - contexts/AuthContext.tsxを完全に書き換え、Amplify Authを統合
  - getCurrentUser()とfetchAuthSession()でセッション永続化を実装
  - checkAuthState()でアプリ起動時に認証状態を復元
  - ConfigureAmplifyClientSide.tsxコンポーネントを新規作成し、app/layout.tsxに追加
  - 全てのエラーメッセージを日本語化

---

### ✅ チケット #2.2: 認証UI/UXの改善
- [x] **ステータス**: ✅ 完了
- **目的**: Cognito特有の機能に対応
- **タスク**:
  - [x] メール検証フローの追加
  - [x] パスワードリセット機能の実装
  - [x] エラーメッセージの日本語化
  - [x] ローディング状態の改善
- **影響ファイル**: `components/auth/*`, `components/layout/Header.tsx`
- **成果物**: メール検証、パスワードリセットが動作する
- **メモ**:
  - SignupForm.tsxにメール確認フローを追加（CONFIRM_EMAIL_REQUIRED処理）
    - 2段階サインアップ実装: 登録フォーム → 確認コード入力画面
    - 確認コード入力画面が表示されない問題を解決（重要な修正）:
      - 問題: AuthProvider再レンダリングによりSignupFormが再マウントされ、状態が失われる
      - 解決: 3層のlocalStorage永続化を実装
        1. AuthPage.tsx: modeをlocalStorageに保存（login/signup/reset）
        2. SignupForm.tsx: needsConfirmationをlocalStorageに保存
        3. SignupForm.tsx: registeredEmailをlocalStorageに保存
      - 重要な実装パターン: setStateの**前に**localStorageに保存することで、コンポーネントアンマウント前にデータを確実に永続化
  - AuthContext.tsxにconfirmSignUp関数を追加
    - Amplify Auth confirmSignUp()を統合
    - エラーハンドリング: CodeMismatch, ExpiredCode, NotAuthorized
    - signup関数内でCONFIRM_EMAIL_REQUIREDエラー時にSET_LOADING dispatchを遅延（AuthPage再マウント防止）
  - ResetPasswordForm.tsxを完全に書き換え、2段階リセットフローを実装
    - Step 1: メールアドレス入力 → 確認コード送信
    - Step 2: 確認コード + 新パスワード入力 → パスワード変更
  - Header.tsxのlogoutを非同期関数に変更してCognito signOut()に対応
  - 全てのエラーメッセージを日本語化済み（AuthContext内）

---

## Phase 3: 個人データのクラウド化

### ✅ チケット #3.1: Amplify Data clientの統合
- [x] **ステータス**: ✅ 完了
- **目的**: LocalStorageからDynamoDB+AppSyncへの移行
- **タスク**:
  - [x] `app/page.tsx`のデータ取得をAmplify Dataに変更
  - [x] `useLocalStorage`から`useEffect` + `useState`への移行
  - [x] データのCRUD操作をGraphQL Mutationに置き換え
  - [x] オプティミスティックUIの実装
- **影響ファイル**: `app/page.tsx`, `components/deck/*`, `components/match/*`
- **成果物**: デッキ・対戦記録がDynamoDBに保存される
- **メモ**:
  - app/page.tsxを全面的に書き換え、Amplify Data clientを統合
  - useEffect でログイン時に自動的にデッキと対戦記録を取得
  - decks と records は useState で管理、currentDeckId のみ LocalStorage で管理
  - handleAddDeck, handleDeleteDeck, handleAddRecord, handleDeleteRecord を全て async 関数に変更
  - オプティミスティック UI を実装（ローカル状態を先に更新し、DynamoDB 操作後に実際の ID で更新）
  - エラー時は再取得してデータを復元
  - 子コンポーネントの型定義を void | Promise<void> に更新
  - ビルド成功を確認

---

### ✅ チケット #3.2: LocalStorage移行ツールの実装
- [x] **ステータス**: ✅ 完了
- **目的**: 既存ユーザーのデータをクラウドに移行
- **タスク**:
  - [x] LocalStorageデータの読み込み機能
  - [x] データのバリデーション
  - [x] バッチインポート機能（Amplify Data経由）
  - [x] 移行完了後のLocalStorageクリア
  - [x] 移行UIの作成（モーダルで表示）
- **新規ファイル**:
  - `components/migration/DataMigrationModal.tsx`
  - `utils/dataMigration.ts`
- **成果物**: LocalStorageのデータをワンクリックでインポート可能
- **メモ**:
  - utils/dataMigration.ts を作成
    - loadLocalStorageData(): LocalStorageからデータを読み込み
    - validateData(): データの妥当性をチェック
    - importDataToDynamoDB(): DynamoDBにバッチインポート（デッキID変換含む）
    - clearLocalStorageData(): 移行後にLocalStorageをクリア
    - hasLocalStorageData(): データ存在チェック
  - components/migration/DataMigrationModal.tsx を作成
    - 5段階のステップ管理: check → confirm → importing → complete → error
    - データプレビュー表示（デッキ数、対戦記録数、デッキ一覧）
    - インポート結果の詳細表示（成功数、エラー詳細）
    - 「後で移行する」ボタンでスキップ可能
  - app/page.tsx に統合
    - useEffect でログイン後に LocalStorage データの有無をチェック
    - データがあれば自動的にモーダルを表示
    - 移行完了後に handleMigrationComplete() でデータを再取得
  - ビルド成功を確認

---

### ✅ チケット #3.3: オフライン対応の検討（オプション）
- [ ] **ステータス**: 未着手
- **優先度**: 低
- **目的**: ネットワーク不安定時の対応
- **タスク**:
  - [ ] オフライン時のエラーハンドリング
  - [ ] データの楽観的更新（Optimistic UI）
  - [ ] リトライロジックの実装
- **成果物**: ネットワークエラー時のUX改善
- **メモ**:

---

## Phase 4: 集計基盤の構築

### ✅ チケット #4.1: Lambda集計関数の実装
- [x] **ステータス**: ✅ 実装完了（デプロイは未完了）
- **目的**: 全ユーザーデータの集計処理
- **タスク**:
  - [x] DynamoDB全件スキャン
  - [x] クラス別統計の集計
  - [x] デッキ別統計の集計
  - [x] マッチアップ統計の集計（デッキAvsデッキB）
  - [x] 先攻後攻統計の集計
  - [x] AggregatedStatsテーブルへの保存
- **新規ファイル**:
  - `amplify/functions/aggregate-stats/handler.ts` ⚠️ **現在はgitヒストリーに保存**
  - `amplify/functions/aggregate-stats/resource.ts` ⚠️ **現在はgitヒストリーに保存**
  - `amplify/functions/aggregate-stats/package.json` ⚠️ **現在はgitヒストリーに保存**
- **集計ロジック**:
  - クラス別: クラスごとの使用数、勝数、敗数、勝率
  - デッキ別: デッキ名ごとの使用数、勝数、敗数、勝率
  - マッチアップ: 自分のクラスA vs 相手のクラスB の勝率
  - 先攻後攻: 先攻時の勝率、後攻時の勝率
- **成果物**: Lambda関数の実装（デプロイは保留）
- **メモ**:
  - handler.ts に集計ロジックを実装
    - scanAllRecords(): MatchRecordを全件スキャン（ページネーション対応）
    - scanAllDecks(): Deckを全件スキャン（ページネーション対応）
    - calculateClassStats(): クラス別統計を集計
    - calculateDeckStats(): デッキ別統計を集計
    - calculateMatchupStats(): マッチアップ統計を集計（自分のクラス vs 相手のクラス）
    - calculateTurnOrderStats(): 先攻後攻統計を集計
    - saveAggregatedStats(): BatchWriteでAggregatedStatsに保存（25件ずつ）
  - resource.ts で Lambda関数を定義（タイムアウト5分、メモリ512MB）
  - amplify/backend.ts を更新
    - Lambda関数を登録
    - DynamoDBテーブル名を環境変数として設定
    - DynamoDB Scan/GetItem/PutItem/BatchWriteItem 権限を付与
  - ビルド成功を確認

  **⚠️ デプロイ状況:**
  - Lambda関数は実装完了したが、Phase 6のデプロイ時に `ampx pipeline-deploy` でAWS SDK bundlingエラーが発生
  - デプロイを保留し、フロントエンドのみデプロイ戦略に変更
  - 関数ファイルは削除されたが、gitヒストリーに保存済み（復元可能）
  - 今後、別の方法でデプロイする予定（AWS CDK直接使用など）

---

### ✅ チケット #4.2: EventBridge定期実行の設定
- [x] **ステータス**: ✅ 実装完了（デプロイは未完了）
- **目的**: 1日1回自動集計
- **タスク**:
  - [x] EventBridgeルールの作成（cron: 0 0 * * *）
  - [x] Lambda関数のトリガー設定
  - [x] CloudWatch Logsでの監視設定
- **成果物**: 毎日0時（UTC）に集計が自動実行される（実装済み、デプロイは保留）
- **メモ**:
  - amplify/backend.ts に EventBridge Rule を追加（gitヒストリーに保存）
  - スケジュール: 毎日UTC 0時（日本時間9時）に実行
  - Lambda関数をターゲットとして設定
  - CloudWatch Logsは自動的に有効（/aws/lambda/aggregate-stats-<env>）
  - ビルド成功を確認

  **⚠️ デプロイ状況:**
  - EventBridge設定は amplify/backend.ts に実装済み
  - Lambda関数と同様、デプロイは保留中（#4.1参照）
  - Lambda関数のデプロイが完了すれば、EventBridgeも同時にデプロイされる

---

### ✅ チケット #4.3: 手動集計トリガーの実装（管理者用・オプション）
- [ ] **ステータス**: 未着手
- **優先度**: 低
- **目的**: 必要に応じて即座に集計を実行
- **タスク**:
  - [ ] 管理者ロールの定義（Cognito User Groups）
  - [ ] 手動実行用のGraphQL Mutation
  - [ ] 管理画面UIの作成
- **成果物**: 管理者が手動で集計を実行可能
- **メモ**:

---

## Phase 5: 全体統計機能の実装

### ✅ チケット #5.1: 公開統計ページの作成
- [x] **ステータス**: ✅ 完了
- **目的**: 未認証でも閲覧可能な統計ページ
- **タスク**:
  - [x] 新規ページ`app/stats/page.tsx`の作成
  - [x] ナビゲーションの追加
  - [x] レイアウトデザイン
- **新規ファイル**:
  - `app/stats/page.tsx`
- **成果物**: `/stats`パスで統計ページにアクセス可能
- **メモ**:
  - app/stats/page.tsx を作成
  - タブナビゲーション実装（class / deck / matchup / turnOrder）
  - AggregatedStats から統計データを取得
  - 未認証ユーザーでもアクセス可能（guest() 認証）
  - 最終更新日時を表示
  - ホームへの戻るリンク追加

---

### ✅ チケット #5.2: クラス別統計コンポーネント
- [x] **ステータス**: ✅ 完了
- **目的**: クラス別の使用率・勝率表示
- **タスク**:
  - [x] AggregatedStatsからクラス統計を取得
  - [x] ランキング形式で表示
- **新規ファイル**: `components/public-stats/ClassStatsPublic.tsx`
- **表示内容**:
  - クラス使用率ランキング
  - クラス勝率ランキング
  - 試合数も表示
- **メモ**:
  - components/public-stats/ClassStatsPublic.tsx を作成
  - サマリーカード: 総試合数、集計クラス数、平均勝率
  - 使用率ランキング: 試合数順、使用率パーセンテージ表示
  - 勝率ランキング: 最低10試合以上でフィルタ、勝率順
  - クラスカラーでビジュアル表示

---

### ✅ チケット #5.3: デッキ別統計コンポーネント
- [x] **ステータス**: ✅ 完了
- **目的**: 具体的なデッキ名ごとの統計
- **タスク**:
  - [x] デッキ統計の取得
  - [x] フィルタリング機能（クラスで絞り込み）
  - [x] ソート機能（使用率順、勝率順）
- **新規ファイル**: `components/public-stats/DeckStatsPublic.tsx`
- **表示内容**:
  - デッキ使用率TOP20
  - デッキ勝率TOP20（最低試合数のフィルタ付き）
- **メモ**:
  - components/public-stats/DeckStatsPublic.tsx を作成
  - クラスフィルター: 全クラス or 特定クラス
  - ソート: 使用率順 or 勝率順
  - 最低試合数フィルター: 5/10/20/50試合以上（勝率順時のみ）
  - TOP20表示、ランキング番号付き
  - クラスカラーのバッジ表示

---

### ✅ チケット #5.4: マッチアップ統計コンポーネント
- [x] **ステータス**: ✅ 完了
- **目的**: クラスAvsクラスBの相性表
- **タスク**:
  - [x] マッチアップデータの取得
  - [x] マトリックス表示（ヒートマップ）
  - [x] 特定のマッチアップの詳細表示
- **新規ファイル**: `components/public-stats/MatchupMatrix.tsx`
- **表示内容**:
  - 7x7のクラスマトリックス（勝率をヒートマップで表示）
  - クリックで詳細モーダル表示
- **メモ**:
  - components/public-stats/MatchupMatrix.tsx を作成
  - デスクトップ: 7x7マトリックステーブル、ヒートマップカラー
  - モバイル: 簡易リスト表示（TOP20）
  - 最低試合数フィルター: 3/5/10/20試合以上
  - ヒートマップ色分け: 60%以上=緑、48-52%=黄、40%未満=赤
  - データ不足セルはグレー表示
  - クリックで詳細モーダル（試合数、勝率、勝敗数）
  - 凡例表示

---

### ✅ チケット #5.5: 先攻後攻統計コンポーネント
- [x] **ステータス**: ✅ 完了
- **目的**: 先攻・後攻の有利不利を可視化
- **タスク**:
  - [x] 先攻後攻データの取得
  - [x] 全体統計の表示
  - [x] プログレスバーでの可視化
- **新規ファイル**: `components/public-stats/TurnOrderStats.tsx`
- **表示内容**:
  - 全体の先攻勝率 vs 後攻勝率
- **メモ**:
  - components/public-stats/TurnOrderStats.tsx を作成
  - サマリーカード: 総試合数、先攻後攻の勝率差
  - 先攻/後攻の並列比較表示（試合数、勝数、敗数、勝率）
  - プログレスバーで勝敗比率を可視化
  - 分析セクション: 先攻有利度、後攻有利度、環境の傾向

---

### ✅ チケット #5.6: 統計ページのパフォーマンス最適化（オプション）
- [ ] **ステータス**: 未着手
- **優先度**: 低
- **目的**: 大量データの高速表示
- **タスク**:
  - [ ] データのキャッシング（SWR or React Query）
  - [ ] ページネーション・仮想スクロール
  - [ ] 画像の遅延読み込み
- **成果物**: 快適に統計ページを閲覧可能
- **メモ**:

---

## Phase 6: デプロイ＆運用

### ✅ チケット #6.1: 本番環境へのデプロイ
- [x] **ステータス**: ✅ 完了（フロントエンドのみ）
- **目的**: AWS本番環境での稼働
- **タスク**:
  - [x] Amplify Hostingの設定
  - [x] CI/CDパイプラインの構築（フロントエンドのみ）
  - [x] 環境変数の設定
  - [ ] ドメインの設定（オプション）
- **成果物**: 本番環境でアプリが稼働（フロントエンド + サンドボックスバックエンド）
- **デプロイ戦略**: フロントエンドのみデプロイ（Lambda関数は今後対応）
- **メモ**:
  - **完了日**: 2025-11-09
  - **デプロイ方式**: フロントエンドのみAmplify Hostingにデプロイ、バックエンドはサンドボックス環境を利用

  **【デプロイ経緯】**

  **発生した問題（8回以上のイテレーション）:**
  1. **GitHub Secret Scanning**: AWS_SETUP_GUIDE.md に実際の認証情報 → プレースホルダーに置き換え
  2. **TypeScript検証エラー**: 非推奨のAmplify Gen2 API使用 → 最新APIに更新
  3. **Lambda AWS SDK解決エラー**: bundling時に @aws-sdk モジュールが解決できない
     - 試行1: bundling.external 設定 → プロパティが存在しない
     - 試行2: devDependenciesに移動 → 解決せず
     - 試行3: amplify.ymlでLambda依存関係をインストール → 解決せず
  4. **CDK Assembly エラー**: manifest.json が生成されない（複数回発生）
     - backend.ts の簡素化
     - functions ディレクトリの削除（TypeScriptが検証し続ける）
  5. **Authorization Mode問題**: allow.guest() にはiam modeが必要 → allow.publicApiKey()に変更
  6. **CDKバージョン不一致**: aws-cdk: 2.1030.0 vs aws-cdk-lib: 2.220.0 → 両方を2.169.0に統一
  7. **ampx pipeline-deploy の根本的な問題**: 上記全て解決してもCDK Assemblyエラーが継続

  **最終解決策:**
  - `amplify.yml` から backend ビルドフェーズを完全削除
  - `amplify_outputs.json` をリポジトリにコミット（サンドボックスバックエンド設定）
  - フロントエンドのみをAmplify Hostingにデプロイ
  - バックエンドはローカルサンドボックスデプロイを継続利用

  **現在のアーキテクチャ:**
  ```
  本番フロントエンド (Amplify Hosting)
    ↓ (amplify_outputs.json経由で接続)
  サンドボックスバックエンド (ローカルデプロイ)
    ├─ Cognito (ユーザー認証)
    ├─ DynamoDB (データストレージ)
    └─ AppSync (GraphQL API)
  ```

  **今後の対応が必要な項目:**
  - Lambda集計関数のデプロイ（gitヒストリーに保存済み）
  - EventBridge定期実行の設定
  - バックエンドCI/CDパイプラインの構築（ampx pipeline-deploy以外の方法を検討）

  **デプロイ成果:**
  - ✅ フロントエンドが本番環境で稼働
  - ✅ Cognito認証が動作
  - ✅ DynamoDB データ操作が動作
  - ✅ 公開統計ページがアクセス可能
  - ⚠️ Lambda自動集計は未デプロイ（手動でデータ投入すれば統計表示は可能）

---

### ✅ チケット #6.2: モニタリング＆アラート設定
- [ ] **ステータス**: 未着手
- **目的**: 運用の安定化
- **タスク**:
  - [ ] CloudWatch Logsの確認
  - [ ] エラーアラートの設定
  - [ ] コスト監視の設定
- **成果物**: 問題発生時に通知される仕組み
- **メモ**:

---

### ✅ チケット #6.3: ドキュメント整備
- [ ] **ステータス**: 未着手
- **目的**: 保守性の向上
- **タスク**:
  - [ ] README更新
  - [ ] アーキテクチャ図の作成
  - [ ] 運用手順書の作成
- **成果物**: 運用ドキュメント一式
- **メモ**:

---

## 📌 優先順位と推奨スケジュール

### 高優先度（MVP）
1. **Phase 1**: AWS基盤構築（#1.1 ~ #1.4）
2. **Phase 2**: 認証機能（#2.1 ~ #2.2）
3. **Phase 3**: データ移行（#3.1 ~ #3.2）

### 中優先度（機能拡張）
4. **Phase 4**: 集計基盤（#4.1 ~ #4.2）
5. **Phase 5**: 公開統計（#5.1 ~ #5.5）

### 低優先度（改善・最適化）
6. **Phase 6**: 運用整備（#6.1 ~ #6.3）
7. **オプション機能**: #3.3, #4.3, #5.6

---

## 📝 進捗更新方法

各チケット完了時に以下を更新：
1. チケットの `[ ]` を `[x]` に変更
2. ステータスを「完了」に変更
3. Phase別進捗テーブルの完了率を更新
4. 全体進捗を更新
5. メモ欄に完了日や気づきを記載

---

## 🔗 関連ドキュメント

- [AWS準備ガイド](./AWS_SETUP_GUIDE.md)
- [プロジェクト構造](./PROJECT_STRUCTURE.md)
- [Claude向けガイド](./CLAUDE.md)
