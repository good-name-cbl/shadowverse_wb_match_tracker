# 🏗️ Shadowverse Worlds Beyond Match Tracker - アーキテクチャ構成図

このドキュメントでは、プロジェクトの現在のアーキテクチャを視覚的に表現し、各コンポーネントの関係性と役割を説明します。

## 📊 目次

1. [全体アーキテクチャ図](#1-全体アーキテクチャ図)
2. [フロントエンドアーキテクチャ](#2-フロントエンドアーキテクチャ)
3. [バックエンドアーキテクチャ](#3-バックエンドアーキテクチャ)
4. [データフロー図](#4-データフロー図)
5. [デプロイメントアーキテクチャ](#5-デプロイメントアーキテクチャ)

---

## 1. 全体アーキテクチャ図

### システム全体の構成

```mermaid
graph TB
    subgraph "Client Side"
        Browser[ブラウザ]
        NextJS[Next.js 14<br/>App Router]
        LocalStorage[LocalStorage<br/>移行データ]
    end

    subgraph "AWS Cloud"
        subgraph "Frontend Hosting"
            Amplify[AWS Amplify Hosting<br/>d1750m4lxqo4gv]
        end

        subgraph "Authentication"
            Cognito[Amazon Cognito<br/>User Pool & Identity Pool]
        end

        subgraph "API Layer"
            AppSync[AWS AppSync<br/>GraphQL API]
            APIKey[API Key<br/>公開統計用]
        end

        subgraph "Database"
            DynamoDB[(DynamoDB)]
            Tables[Season / User / Deck<br/>MatchRecord / AggregatedStats]
        end

        subgraph "Compute"
            Lambda[Lambda Function<br/>aggregate-stats]
            EventBridge[EventBridge<br/>Daily Scheduler]
        end
    end

    Browser -->|HTTPS| NextJS
    NextJS -->|デプロイ| Amplify
    NextJS -->|認証| Cognito
    NextJS -->|GraphQL| AppSync
    NextJS -->|移行時読み込み| LocalStorage

    AppSync -->|認証確認| Cognito
    AppSync -->|API Key認証| APIKey
    AppSync -->|CRUD操作| DynamoDB
    DynamoDB --> Tables

    EventBridge -->|毎日UTC 0時| Lambda
    Lambda -->|集計処理| DynamoDB

    style Amplify fill:#FF9900
    style Cognito fill:#FF9900
    style AppSync fill:#FF9900
    style DynamoDB fill:#3369E7
    style Lambda fill:#FF9900
    style EventBridge fill:#FF9900
```

### 認証フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant App as Next.js App
    participant Auth as AuthContext
    participant Cognito as Amazon Cognito
    participant API as AppSync API

    User->>App: アプリアクセス
    App->>Auth: 認証状態確認
    Auth->>Cognito: getCurrentUser()

    alt 未認証
        Cognito-->>Auth: 未認証
        Auth-->>App: isAuthenticated: false
        App->>User: ログイン画面表示
        User->>App: ログイン情報入力
        App->>Auth: login(email, password)
        Auth->>Cognito: signIn()
        Cognito-->>Auth: 認証トークン
        Auth-->>App: 認証成功
        App->>User: メインアプリ表示
    else 認証済み
        Cognito-->>Auth: ユーザー情報
        Auth-->>App: isAuthenticated: true
        App->>API: GraphQL Query/Mutation
        API->>Cognito: トークン検証
        Cognito-->>API: 検証OK
        API-->>App: データ返却
    end
```

---

## 2. フロントエンドアーキテクチャ

### コンポーネント階層図

```mermaid
graph TD
    subgraph "App Router Structure"
        Layout[app/layout.tsx<br/>ルートレイアウト]
        HomePage[app/page.tsx<br/>メインページ]
        StatsPage[app/stats/page.tsx<br/>公開統計ページ]
        AdminPages[app/admin/*<br/>管理画面]
    end

    subgraph "Context Providers"
        ConfigAmplify[ConfigureAmplifyClientSide<br/>Amplify初期化]
        AuthProvider[AuthProvider<br/>認証状態管理]
    end

    subgraph "Main Application Components"
        Header[Header<br/>ナビゲーション]
        TabNav[タブナビゲーション<br/>Decks / Matches / Stats]
        Migration[DataMigrationModal<br/>データ移行UI]
    end

    subgraph "Feature Sections"
        DeckSection[DeckSection]
        MatchSection[MatchSection]
        StatsSection[StatsSection]
    end

    subgraph "Deck Components"
        DeckForm[DeckForm<br/>デッキ登録]
        DeckList[DeckList<br/>デッキ一覧]
        DeckTemplate[DeckTemplateSelector<br/>テンプレート選択]
    end

    subgraph "Match Components"
        DeckSelector[DeckSelector<br/>使用デッキ選択]
        MatchForm[MatchForm<br/>対戦記録入力]
        MatchHistory[MatchHistory<br/>履歴表示]
    end

    subgraph "Stats Components"
        SeasonFilter[SeasonFilter<br/>シーズン選択]
        DeckFilter[DeckFilter<br/>デッキフィルター]
        OverallStats[OverallStats<br/>全体統計]
        ClassStats[ClassStats<br/>クラス別統計]
        DeckTypeStats[DeckTypeStats<br/>デッキ別統計]
    end

    Layout --> ConfigAmplify
    ConfigAmplify --> AuthProvider
    AuthProvider --> HomePage
    AuthProvider --> StatsPage
    AuthProvider --> AdminPages

    HomePage --> Header
    HomePage --> TabNav
    HomePage --> Migration
    HomePage --> DeckSection
    HomePage --> MatchSection
    HomePage --> StatsSection

    DeckSection --> DeckForm
    DeckSection --> DeckList
    DeckForm --> DeckTemplate

    MatchSection --> DeckSelector
    MatchSection --> MatchForm
    MatchSection --> MatchHistory

    StatsSection --> SeasonFilter
    StatsSection --> DeckFilter
    StatsSection --> OverallStats
    StatsSection --> ClassStats
    StatsSection --> DeckTypeStats
```

### 状態管理フロー

```mermaid
graph LR
    subgraph "Global State (Context)"
        AuthState[Authentication State<br/>user, isAuthenticated]
    end

    subgraph "Page State (app/page.tsx)"
        Decks["decks: Deck Array"]
        Records["records: MatchRecord Array"]
        Seasons["seasons: Season Array"]
        CurrentDeck[currentDeckId]
        CurrentSeason[currentSeasonId]
        ActiveTab[activeTab]
    end

    subgraph "Local State (Components)"
        FormInputs[Form Inputs]
        UIState[UI State<br/>modals, toggles]
    end

    subgraph "Data Sources"
        DynamoDB2[(DynamoDB)]
        LocalStorage2[LocalStorage<br/>currentDeckId only]
    end

    AuthState -->|Context Provider| Page
    Page[app/page.tsx] -->|Props| Components[Child Components]
    Components -->|Event Handlers| Page
    Page <-->|CRUD Operations| DynamoDB2
    Page <-->|Persist Selection| LocalStorage2
    Components --> FormInputs
    Components --> UIState
```

---

## 3. バックエンドアーキテクチャ

### AWS Amplifyバックエンド構成

```mermaid
graph TB
    subgraph "Amplify Backend Definition"
        Backend[amplify/backend.ts<br/>バックエンド統合]
        AuthResource[amplify/auth/resource.ts<br/>Cognito設定]
        DataResource[amplify/data/resource.ts<br/>GraphQLスキーマ]
    end

    subgraph "Amazon Cognito"
        UserPool[User Pool<br/>ap-northeast-1_9qw1qpSiX]
        IdentityPool[Identity Pool<br/>fc8f2e20-45d7-40eb-bdf2]
        UserPoolClient[User Pool Client<br/>2ajng13447hhbt8ji7bksbi8oq]
    end

    subgraph "AWS AppSync"
        GraphQLAPI[GraphQL API<br/>df7vocdurnaynkgzi4bnmha3fu]
        Resolvers[Resolvers<br/>Auto-generated]
        APIKeyAuth[API Key Auth<br/>da2-zrtrdmlpkja47kbckvtswef5ya]
    end

    subgraph "DynamoDB Tables"
        SeasonTable[(Season Table)]
        UserTable[(User Table)]
        DeckTable[(Deck Table)]
        MatchTable[(MatchRecord Table)]
        StatsTable[(AggregatedStats Table)]
    end

    subgraph "Lambda Functions"
        AggregateLambda[aggregate-stats<br/>統計集計関数]
    end

    Backend --> AuthResource
    Backend --> DataResource
    AuthResource --> UserPool
    UserPool --> UserPoolClient
    UserPool --> IdentityPool

    DataResource --> GraphQLAPI
    GraphQLAPI --> Resolvers
    GraphQLAPI --> APIKeyAuth
    Resolvers --> SeasonTable
    Resolvers --> UserTable
    Resolvers --> DeckTable
    Resolvers --> MatchTable
    Resolvers --> StatsTable

    AggregateLambda -->|集計処理| MatchTable
    AggregateLambda -->|結果保存| StatsTable
```

### データモデル関係図

```mermaid
erDiagram
    User ||--o{ Deck : owns
    User ||--o{ MatchRecord : creates
    Deck ||--o{ MatchRecord : uses
    Season ||--o{ MatchRecord : contains
    Season ||--o{ AggregatedStats : has

    User {
        string id PK
        string email
        datetime createdAt
    }

    Deck {
        string id PK
        string userId FK
        string className
        string deckName
        datetime createdAt
    }

    MatchRecord {
        string id PK
        string userId FK
        string myDeckId FK
        string seasonId FK
        string opponentClass
        string opponentDeckType
        boolean isFirstPlayer
        boolean isWin
        datetime recordedAt
    }

    Season {
        string id PK
        string name
        string startDate
        string endDate
        json templates
        datetime createdAt
    }

    AggregatedStats {
        string id PK
        string seasonId FK
        string seasonName
        string statsType
        string statsKey
        int totalGames
        int wins
        int losses
        float winRate
        json metadata
        datetime updatedAt
    }
```

---

## 4. データフロー図

### CRUD操作フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as UIコンポーネント
    participant Page as app/page.tsx
    participant Client as Amplify Client
    participant API as AppSync API
    participant DB as DynamoDB

    User->>UI: デッキ追加ボタンクリック
    UI->>Page: handleAddDeck(className, deckName)

    Note over Page: Optimistic UI Update
    Page->>Page: setDecks([...decks, tempDeck])
    Page->>UI: 即座にUI更新

    Page->>Client: client.models.Deck.create()
    Client->>API: GraphQL Mutation
    API->>DB: PutItem
    DB-->>API: Success
    API-->>Client: Deck with ID
    Client-->>Page: Created Deck

    alt 成功
        Page->>Page: 実際のIDで更新
        Page->>UI: 最終的なUI更新
    else 失敗
        Page->>Page: 元の状態に戻す
        Page->>UI: エラー表示
    end
```

### LocalStorageデータ移行フロー

```mermaid
flowchart TD
    Start([ユーザーログイン]) --> Check{LocalStorage<br/>データ存在？}
    Check -->|Yes| ShowModal[DataMigrationModal<br/>表示]
    Check -->|No| MainApp[メインアプリ表示]

    ShowModal --> UserChoice{ユーザー選択}
    UserChoice -->|インポート| Import[importDataToDynamoDB]
    UserChoice -->|削除| Delete[clearLocalStorageData]
    UserChoice -->|後で| MainApp

    Import --> LoadData[LocalStorageから<br/>データ読み込み]
    LoadData --> Validate[データバリデーション]
    Validate --> CreateDecks[デッキを<br/>DynamoDBに作成]
    CreateDecks --> MapIDs[旧ID→新ID<br/>マッピング作成]
    MapIDs --> CreateRecords[対戦記録を<br/>新IDで作成]
    CreateRecords --> ClearLS[LocalStorage<br/>クリア]
    ClearLS --> Refresh[データ再取得]
    Refresh --> MainApp

    Delete --> ClearLS2[LocalStorage<br/>完全削除]
    ClearLS2 --> MainApp
```

### 集計処理フロー

```mermaid
flowchart LR
    subgraph "Trigger"
        EventBridge[EventBridge<br/>Daily at 0:00 UTC]
    end

    subgraph "Lambda Function"
        Start2[開始] --> Scan[MatchRecord<br/>テーブルスキャン]
        Scan --> Group[データグループ化]
        Group --> CalcClass[クラス別<br/>統計計算]
        Group --> CalcDeck[デッキ別<br/>統計計算]
        Group --> CalcMatchup[マッチアップ<br/>統計計算]
        Group --> CalcTurn[先攻後攻<br/>統計計算]

        CalcClass --> Save[AggregatedStats<br/>テーブルに保存]
        CalcDeck --> Save
        CalcMatchup --> Save
        CalcTurn --> Save
    end

    subgraph "Public Stats Page"
        Query[GraphQL Query<br/>with API Key] --> Display[統計表示]
    end

    EventBridge -->|Invoke| Start2
    Save -->|Write| StatsDB[(AggregatedStats)]
    StatsDB -->|Read| Query
```

---

## 5. デプロイメントアーキテクチャ

### 現在のデプロイ構成

```mermaid
graph TB
    subgraph "Development"
        LocalDev[ローカル開発環境<br/>npm run dev]
        Sandbox[Amplify Sandbox<br/>npx ampx sandbox]
    end

    subgraph "CI/CD Pipeline"
        GitHub[GitHub Repository]
        AmplifyConsole[Amplify Console<br/>自動デプロイ]
    end

    subgraph "Production Environment"
        Frontend[Amplify Hosting<br/>main.d1750m4lxqo4gv.amplifyapp.com]

        subgraph "Backend Services (Auto-deployed)"
            ProdCognito[Cognito User Pool]
            ProdAppSync[AppSync API]
            ProdDynamoDB[DynamoDB Tables]
        end

        subgraph "Backend Services (Manual)"
            ProdLambda[Lambda Function<br/>手動デプロイ済み]
            ProdEventBridge[EventBridge Rule<br/>手動設定済み]
        end
    end

    LocalDev --> Sandbox
    Sandbox --> GitHub
    GitHub -->|Push to main| AmplifyConsole
    AmplifyConsole -->|Build & Deploy| Frontend
    AmplifyConsole -->|Deploy Backend| ProdCognito
    AmplifyConsole -->|Deploy Backend| ProdAppSync
    AmplifyConsole -->|Deploy Backend| ProdDynamoDB
    AmplifyConsole -.->|現在無効化| ProdLambda

    style ProdLambda fill:#ffcccc
    style ProdEventBridge fill:#ffcccc
```

### 環境変数と設定

```mermaid
graph LR
    subgraph "Configuration Files"
        AmplifyOutputs[amplify_outputs.json<br/>自動生成]
        AmplifyYml[amplify.yml<br/>ビルド設定]
        EnvLocal[.env.local<br/>ローカル環境変数]
    end

    subgraph "AWS Resources"
        Cognito2[Cognito Settings]
        AppSync2[AppSync Endpoint]
        APIKeys[API Keys]
    end

    subgraph "Application"
        NextConfig[next.config.js]
        AmplifyClient[Amplify.configure]
    end

    AmplifyOutputs --> AmplifyClient
    Cognito2 --> AmplifyOutputs
    AppSync2 --> AmplifyOutputs
    APIKeys --> AmplifyOutputs

    EnvLocal --> NextConfig
    NextConfig --> AmplifyClient
    AmplifyYml --> BuildProcess[Build Process]
```

---

## 📊 アーキテクチャの特徴

### 強み
- **サーバーレス**: 完全なサーバーレスアーキテクチャで運用コスト最小化
- **スケーラブル**: AWS管理サービスによる自動スケーリング
- **型安全**: TypeScript + GraphQLによる型安全性
- **認証統合**: Cognitoによるセキュアな認証
- **リアルタイム対応**: AppSync Subscriptionsで将来的にリアルタイム機能追加可能

### 現在の課題
- Lambda関数の自動デプロイが無効化されている
- API Keyがコードにハードコード
- 一部のページで直接fetch()を使用（Amplifyクライアントを回避）

### 改善提案
1. Lambda関数のTypeScript設定を修正してCI/CD復旧
2. API KeyをAWS Systems Manager Parameter Storeで管理
3. Amplifyクライアントの認証モード切り替えを修正
4. CloudWatchによる監視とアラートの設定

---

## 🔄 更新履歴

- **2025-11-10**: 初版作成
- 現在のアーキテクチャ状態を反映
- AWS Amplify Gen2への移行完了状態を記載
- Lambda関数の手動デプロイ状況を明記