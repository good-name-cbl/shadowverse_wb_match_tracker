# シャドウバース ワールズビヨンド 対戦記録ツール - プロジェクト構成ガイド

## 目次

1. [プロジェクト全体のアーキテクチャ](#1-プロジェクト全体のアーキテクチャ)
2. [データフローと状態管理](#2-データフローと状態管理)
3. [主要なコンポーネントの役割](#3-主要なコンポーネントの役割)
4. [ユーティリティ関数とヘルパー](#4-ユーティリティ関数とヘルパー)
5. [重要なデザインパターンとベストプラクティス](#5-重要なデザインパターンとベストプラクティス)
6. [今後AWS Amplifyに統合する際のポイント](#6-今後aws-amplifyに統合する際のポイント)

---

## 1. プロジェクト全体のアーキテクチャ

### 1.1 レイヤー構造

このアプリケーションは以下の4層構造で設計されています：

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)           │  ← Reactコンポーネント
│   - app/page.tsx                    │
│   - components/*                    │
├─────────────────────────────────────┤
│   State Management Layer            │  ← 状態管理
│   - contexts/AuthContext.tsx        │
│   - hooks/useLocalStorage.ts        │
├─────────────────────────────────────┤
│   Business Logic Layer              │  ← ビジネスロジック
│   - utils/statistics.ts             │
│   - utils/deckTemplates.ts          │
├─────────────────────────────────────┤
│   Data Layer                        │  ← データ永続化
│   - LocalStorage (現在)            │
│   - DynamoDB (将来)                 │
└─────────────────────────────────────┘
```

### 1.2 ディレクトリ構成

```
プロジェクトルート/
│
├── app/                        # Next.js App Router（ルーティング層）
│   ├── layout.tsx             # アプリ全体のレイアウト、AuthProvider統合
│   ├── page.tsx               # メインページ（エントリーポイント）
│   └── globals.css            # Tailwind CSSのグローバルスタイル
│
├── components/                 # UIコンポーネント層
│   ├── auth/                  # 認証関連のUIコンポーネント
│   ├── deck/                  # デッキ管理のUIコンポーネント
│   ├── layout/                # 共通レイアウトコンポーネント
│   ├── match/                 # 対戦記録のUIコンポーネント
│   ├── stats/                 # 統計情報のUIコンポーネント
│   └── ui/                    # 再利用可能な基本UIコンポーネント
│
├── contexts/                   # React Contextによる状態管理
│   └── AuthContext.tsx        # 認証状態のグローバル管理
│
├── hooks/                      # カスタムReactフック
│   └── useLocalStorage.ts     # LocalStorageとReactステートの同期
│
├── types/                      # TypeScript型定義
│   └── index.ts               # アプリ全体で使用する型定義
│
└── utils/                      # ユーティリティ関数・ビジネスロジック
    ├── constants.ts           # 定数定義（クラス名、色など）
    ├── deckTemplates.ts       # デッキテンプレート定義
    └── statistics.ts          # 統計計算ロジック
```

---

## 2. データフローと状態管理

### 2.1 アプリケーション起動フロー

```
1. app/layout.tsx (ルートレイアウト)
   ↓
   - Interフォントをロード
   - <AuthProvider>で全体をラップ（認証状態を全コンポーネントで利用可能に）
   ↓
2. contexts/AuthContext.tsx (認証状態の初期化)
   ↓
   - LocalStorageから保存済みユーザー情報を読み込み
   - 認証状態を初期化
   ↓
3. app/page.tsx (メインページ)
   ↓
   - useAuth()で認証状態を取得
   - ログイン済み → アプリ画面表示
   - 未ログイン → 認証画面表示
```

### 2.2 状態管理の3層構造

#### ① グローバル状態（全体で共有）

- **管理場所**: `contexts/AuthContext.tsx`
- **内容**: ユーザーの認証状態
- **アクセス方法**: `useAuth()` フック

```typescript
// 認証状態の構造
interface AuthState {
  isAuthenticated: boolean;  // ログイン済みか
  user: User | null;         // ユーザー情報
  isLoading: boolean;        // ロード中か
}
```

#### ② ページローカル状態（page.tsxで管理）

- **管理場所**: `app/page.tsx`
- **内容**: デッキ、対戦記録、現在選択中のデッキ
- **永続化**: LocalStorageに自動保存（useLocalStorageフック使用）

```typescript
// page.tsx内の状態管理
const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);
const [records, setRecords] = useLocalStorage<MatchRecord[]>('records', []);
const [currentDeckId, setCurrentDeckId] = useLocalStorage<string | null>('currentDeckId', null);
const [activeTab, setActiveTab] = useState<ActiveTab>('decks');
```

**重要なポイント**:
- `useLocalStorage`を使うことで、ブラウザを閉じても**データが保持される**
- `useState`は通常のReact状態（ブラウザを閉じると消える）

#### ③ コンポーネントローカル状態

- **管理場所**: 各コンポーネント内
- **内容**: フォーム入力値、開閉状態など
- **例**: MatchFormの入力値、DeckTemplateSelectorの選択状態

### 2.3 データフロー図

```
┌─────────────────────────────────────────────────────────┐
│                    app/page.tsx                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 状態:                                            │   │
│  │ - decks: Deck[]           (LocalStorage保存)   │   │
│  │ - records: MatchRecord[]  (LocalStorage保存)   │   │
│  │ - currentDeckId: string   (LocalStorage保存)   │   │
│  │ - activeTab: 'decks'|'matches'|'stats'         │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│       データをPropsとして子コンポーネントに渡す           │
│                          ↓                              │
│  ┌──────────┬──────────────┬────────────────────┐     │
│  ↓          ↓              ↓                    ↓     │
│ DeckSection MatchSection  StatsSection                 │
│  ↓          ↓              ↓                           │
│ ユーザー操作 ユーザー操作    統計計算                   │
│  ↓          ↓              ↑                           │
│ handleAdd  handleAdd       │                           │
│ Deck       Record          │                           │
│  ↓          ↓              │                           │
│ setDecks() setRecords()────┘                           │
│  ↓          ↓                                          │
│ LocalStorageに自動保存                                  │
└─────────────────────────────────────────────────────────┘
```

### 2.4 useLocalStorageの仕組み

```typescript
// useLocalStorageの動作フロー

1. 初期化時
   - LocalStorageからデータを読み込む
   - データがあれば → JSON.parseして使用
   - データがなければ → initialValueを使用

2. 値の更新時
   - setValueが呼ばれる
   - React stateを更新（画面に反映）
   - 同時にLocalStorageにも保存（永続化）

使用例:
const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);
                          ↑                       ↑       ↑
                          フック名                 キー    初期値

// 値の読み取り
console.log(decks); // LocalStorageから読み込んだデッキリスト

// 値の更新（自動的にLocalStorageにも保存される）
setDecks([...decks, newDeck]);
```

---

## 3. 主要なコンポーネントの役割

### 3.1 app/page.tsx（メインコントローラー）

このファイルは**アプリ全体の司令塔**です。

```typescript
app/page.tsxの役割:

1. データ管理
   - decks: 登録されたデッキの配列
   - records: 対戦記録の配列
   - currentDeckId: 現在選択中のデッキID
   - activeTab: 現在表示中のタブ

2. イベントハンドラー
   - handleAddDeck: デッキ追加
   - handleSelectDeck: デッキ選択
   - handleDeleteDeck: デッキ削除（関連する対戦記録も削除）
   - handleAddRecord: 対戦記録追加
   - handleDeleteRecord: 対戦記録削除

3. 画面表示の制御
   - activeTabに応じて表示するセクションを切り替え
   - 各セクションにデータとハンドラーを渡す
```

### 3.2 コンポーネント階層

```
app/page.tsx（データ管理の中心）
│
├─ Layout（ヘッダー付きレイアウト）
│   └─ Header（ユーザー情報、ログアウト、現在のデッキ表示）
│
├─ DeckSection（デッキ管理セクション）
│   ├─ DeckForm（デッキ追加フォーム）
│   │   └─ DeckTemplateSelector（テンプレート選択）
│   └─ DeckList（デッキ一覧）
│
├─ MatchSection（対戦記録セクション）
│   ├─ DeckSelector（使用デッキ選択）
│   ├─ MatchForm（対戦結果入力フォーム）
│   ├─ MatchHistory（対戦履歴・デスクトップ版）
│   └─ MatchHistoryMobile（対戦履歴・モバイル版）
│
└─ StatsSection（統計情報セクション）
    ├─ DeckFilter（デッキフィルター）
    ├─ OverallStats（全体統計）
    ├─ ClassStats（クラス別統計・デスクトップ版）
    ├─ ClassStatsMobile（クラス別統計・モバイル版）
    └─ DeckTypeStats（デッキタイプ別統計）
```

### 3.3 各セクションの詳細

#### DeckSection（デッキ管理）

```typescript
DeckSectionの役割:

Props（受け取るデータ）:
- decks: 登録済みデッキのリスト
- currentDeckId: 現在選択中のデッキID
- onAddDeck: デッキ追加時に呼ぶ関数
- onSelectDeck: デッキ選択時に呼ぶ関数
- onDeleteDeck: デッキ削除時に呼ぶ関数

構成:
┌──────────────────────────┐
│ DeckSection              │
│ ┌──────────────────────┐ │
│ │ DeckForm             │ │ ← デッキ追加フォーム
│ │ - クラス選択         │ │
│ │ - デッキ名入力       │ │
│ │ - テンプレート選択   │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ DeckList             │ │ ← 登録済みデッキ一覧
│ │ - デッキカード表示   │ │
│ │ - 選択/削除ボタン    │ │
│ └──────────────────────┘ │
└──────────────────────────┘

データの流れ:
1. ユーザーがDeckFormでデッキを作成
2. DeckForm → onAddDeck(className, deckName)
3. page.tsx → handleAddDeck → setDecks（状態更新）
4. DeckListに新しいdecksが渡され、画面に表示
```

#### MatchSection（対戦記録）

```typescript
MatchSectionの役割:

構成:
┌────────────────────────────┐
│ MatchSection               │
│ ┌────────────────────────┐ │
│ │ DeckSelector           │ │ ← 使用デッキ選択
│ │ (デッキを選んでから   │ │
│ │  対戦記録を入力)       │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ MatchForm              │ │ ← 対戦結果入力
│ │ - 相手のクラス選択     │ │
│ │ - 相手のデッキ入力     │ │
│ │ - 先攻/後攻選択        │ │
│ │ - 勝敗選択             │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ MatchHistory           │ │ ← 対戦履歴表示
│ │ (デスクトップ: テーブル)│ │
│ │ (モバイル: カード形式)  │ │
│ └────────────────────────┘ │
└────────────────────────────┘

重要な仕様:
- currentDeckが選択されていないと記録できない
- 記録時にcurrentDeck.idが自動的に紐づけられる
```

#### StatsSection（統計情報）

```typescript
StatsSectionの特徴:

1. useMemoによるパフォーマンス最適化
   - 統計計算は重い処理
   - recordsやselectedDeckIdが変わった時のみ再計算
   - 無駄な再計算を防ぐ

構成:
┌────────────────────────────┐
│ StatsSection               │
│ ┌────────────────────────┐ │
│ │ DeckFilter             │ │ ← デッキでフィルタ
│ │ (全デッキ/特定デッキ)   │ │
│ └────────────────────────┘ │
│         ↓ フィルタリング    │
│ ┌────────────────────────┐ │
│ │ OverallStats           │ │ ← 全体統計
│ │ - 総試合数             │ │
│ │ - 勝利数/敗北数        │ │
│ │ - 勝率                 │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ ClassStats             │ │ ← クラス別統計
│ │ (7クラス全ての統計)     │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ DeckTypeStats          │ │ ← デッキタイプ別統計
│ │ - 先攻時の勝率         │ │
│ │ - 後攻時の勝率         │ │
│ └────────────────────────┘ │
└────────────────────────────┘

データフロー:
records → filterRecordsByDeck → filteredRecords
                                       ↓
                    ┌──────────────────┼──────────────────┐
                    ↓                  ↓                  ↓
            calculateOverallStats  calculateClassStats  calculateDeckTypeStats
                    ↓                  ↓                  ↓
              overallStats        classStats        deckTypeStats
                    ↓                  ↓                  ↓
              表示コンポーネントに渡される
```

---

## 4. ユーティリティ関数とヘルパー

### 4.1 types/index.ts（型定義）

```typescript
型定義の解説:

1. ClassType
   - シャドウバースの7クラスを定義
   - Union型で定義 → タイプミスを防ぐ

2. 主要なデータ型:

   User - ユーザー情報
   ├─ id: ユーザーID
   ├─ email: メールアドレス
   └─ createdAt: アカウント作成日時

   Deck - デッキ情報
   ├─ id: デッキID
   ├─ userId: 所有者のユーザーID
   ├─ className: クラス（ClassType）
   ├─ deckName: デッキ名
   └─ createdAt: 作成日時

   MatchRecord - 対戦記録
   ├─ id: 記録ID
   ├─ userId: ユーザーID
   ├─ myDeckId: 使用したデッキのID（Deckと紐づく）
   ├─ opponentClass: 相手のクラス
   ├─ opponentDeckType: 相手のデッキタイプ
   ├─ isFirstPlayer: 先攻ならtrue
   ├─ isWin: 勝利ならtrue
   └─ recordedAt: 記録日時

3. 統計用の型:

   MatchStatistics - 基本統計
   ├─ totalGames: 総試合数
   ├─ wins: 勝利数
   ├─ losses: 敗北数
   └─ winRate: 勝率（%）

   ClassStatistics
   MatchStatistics + className

   DeckTypeStatistics
   MatchStatistics + deckType + 先攻/後攻別統計

データの関連性:
User ─┬─ Deck（1ユーザー: 複数デッキ）
      └─ MatchRecord（1ユーザー: 複数記録）

Deck ── MatchRecord（1デッキ: 複数記録）
        myDeckIdで紐づく
```

### 4.2 utils/statistics.ts（統計計算）

```typescript
統計計算関数の解説:

1. calculateOverallStats
   全体統計を計算する基本関数

   入力: MatchRecord[]（対戦記録の配列）
   出力: MatchStatistics

   処理:
   - 総試合数 = 配列の長さ
   - 勝利数 = isWin === true の数
   - 敗北数 = 総試合数 - 勝利数
   - 勝率 = (勝利数 / 総試合数) × 100
   - 小数点第1位に丸める

   例:
   records = [
     { isWin: true },
     { isWin: true },
     { isWin: false }
   ]
   → { totalGames: 3, wins: 2, losses: 1, winRate: 66.7 }

2. calculateClassStats
   クラス別の統計を計算

   処理フロー:
   1. 7クラス全てをループ
   2. 各クラスとの対戦記録をフィルタリング
   3. calculateOverallStatsで統計計算
   4. 対戦数が多い順にソート

3. calculateDeckTypeStats
   デッキタイプ別統計（先攻/後攻も分ける）

   処理フロー:
   1. Mapでデッキタイプごとに記録をグループ化
   2. 各デッキタイプで:
      - 全体統計を計算
      - 先攻時の記録で統計計算
      - 後攻時の記録で統計計算
   3. 対戦数が多い順にソート

4. filterRecordsByDeck
   特定のデッキでフィルタリング

   - deckId === null → 全記録を返す
   - deckId指定あり → そのデッキの記録のみ返す
```

### 4.3 utils/constants.ts（定数・ヘルパー）

```typescript
定数とヘルパー関数の解説:

1. CLASSES
   7クラスの配列

   使用場所:
   - セレクトボックスの選択肢生成
   - 統計計算でのクラス一覧取得

2. CLASS_COLORS
   各クラスに対応する背景色（Tailwind CSS）

   使用場所:
   - デッキカードの背景色
   - クラス名表示のバッジ色

   例:
   <div className={CLASS_COLORS['エルフ']}>
     エルフ
   </div>
   → 緑色の背景

3. getWinRateColor
   勝率に応じた色を返す

   ロジック:
   - 60%以上 → 緑（高勝率）
   - 40-60% → 黄色（中勝率）
   - 40%未満 → 赤（低勝率）

   使用場所:
   - 統計表示の勝率の色付け
```

### 4.4 utils/deckTemplates.ts（デッキテンプレート）

```typescript
デッキテンプレートの解説:

1. DeckTemplate型
   各デッキテンプレートの情報

   - name: デッキ名（例: 'リノエルフ'）
   - archetype: デッキタイプ（4種類）
     - アグロ: 序盤から攻める速攻デッキ
     - ミッドレンジ: 中盤に強いバランス型
     - コンボ: 特定のカードの組み合わせで勝つ
     - コントロール: 相手を抑えて後半勝つ
   - tier: 環境での強さランク（1が最強）

2. DECK_TEMPLATES
   クラスごとの主要デッキテンプレート集

   構造:
   {
     'エルフ': [デッキ1, デッキ2, ...],
     'ロイヤル': [デッキ1, デッキ2, ...],
     ...
   }

   使用場所:
   - DeckTemplateSelector（デッキ作成時の補助機能）
   - ユーザーがクラスを選択すると、そのクラスの
     テンプレートが表示される
```

---

## 5. 重要なデザインパターンとベストプラクティス

### 5.1 単一責任の原則（SRP）

各コンポーネントは1つの責任のみを持つ：

```
✅ 良い例:
- DeckForm: デッキ入力フォームのみ担当
- DeckList: デッキ一覧表示のみ担当
- DeckSection: DeckFormとDeckListを組み合わせる

❌ 悪い例:
- DeckSection内にフォームとリストのロジックを全部書く
```

### 5.2 Props Drilling（データの受け渡し）

```
データの流れ:

app/page.tsx（データの所有者）
    ↓ props
DeckSection（中継者）
    ↓ props
DeckList（表示者）

重要: データは常に上から下に流れる（単方向データフロー）
```

### 5.3 useLocalStorageパターン

```typescript
// React stateとLocalStorageを自動同期
const [data, setData] = useLocalStorage('key', initialValue);

メリット:
1. ページをリロードしてもデータが残る
2. 通常のuseStateと同じように使える
3. 保存処理を意識する必要がない

現在の使用箇所:
- decks（デッキリスト）
- records（対戦記録）
- currentDeckId（選択中のデッキ）
```

### 5.4 useMemoによる最適化

```typescript
// 統計計算は重いので、必要な時だけ再計算
const stats = useMemo(
  () => calculateStats(records),
  [records]  // recordsが変わった時だけ再計算
);

メリット:
- 無駄な再計算を防ぐ
- パフォーマンス向上

使用箇所:
- StatsSectionの全ての統計計算
```

---

## 6. 今後AWS Amplifyに統合する際のポイント

現在のLocalStorageベースの実装から、AWS Amplifyへの移行時に変更が必要な部分：

### 6.1 認証（AuthContext）

```typescript
// 現在（モック）
const login = async (email, password) => {
  const user = { id: Date.now().toString(), email, ... };
  localStorage.setItem('user', JSON.stringify(user));
};

// AWS Amplify移行後
import { signIn } from 'aws-amplify/auth';

const login = async (email, password) => {
  const { isSignedIn, nextStep } = await signIn({
    username: email,
    password
  });
  // Cognitoから返されたユーザー情報を使用
};
```

### 6.2 データ管理（page.tsx）

```typescript
// 現在（LocalStorage）
const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);

// AWS Amplify移行後
import { generateClient } from 'aws-amplify/data';
const client = generateClient<Schema>();

// データ取得
const { data: decks } = await client.models.Deck.list();

// データ追加
await client.models.Deck.create({
  className,
  deckName,
  userId: user.id
});
```

変更が必要なのは**データ層のみ**で、UIコンポーネントは**そのまま使える**設計になっています。

---

## まとめ

### プロジェクトの特徴

1. **レイヤー分離**: UI、状態管理、ビジネスロジック、データが分離
2. **型安全**: TypeScriptで全体を型付け
3. **単方向データフロー**: Reactのベストプラクティスに従った設計
4. **再利用性**: UIコンポーネントは汎用的に設計
5. **パフォーマンス最適化**: useMemoで重い計算を最適化
6. **AWS移行準備済み**: データ層のみ変更すればAWS Amplifyに移行可能

### ファイルの役割早見表

```
app/
  layout.tsx          - アプリ全体のレイアウト、AuthProvider統合
  page.tsx            - メインロジック、データ管理の中心

components/
  auth/               - 認証UI（ログイン、サインアップなど）
  deck/               - デッキ管理UI
  layout/             - 共通レイアウト（ヘッダーなど）
  match/              - 対戦記録UI
  stats/              - 統計表示UI
  ui/                 - 基本UIコンポーネント（ボタン、入力など）

contexts/
  AuthContext.tsx     - グローバル認証状態管理

hooks/
  useLocalStorage.ts  - LocalStorageとReact state同期

types/
  index.ts            - 全体の型定義

utils/
  constants.ts        - 定数、ヘルパー関数
  deckTemplates.ts    - デッキテンプレート定義
  statistics.ts       - 統計計算ロジック
```

この構成により、**保守性**、**拡張性**、**テスト容易性**を高めています。

---

## 開発の進め方

### ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、アプリケーションが表示されます。

### ビルド

```bash
npm run build
```

### 今後の開発ステップ

1. **Phase 1**: AWS Amplify認証の統合（Cognito）
2. **Phase 2**: GraphQL APIの実装（AppSync）
3. **Phase 3**: DynamoDBとの連携
4. **Phase 4**: デプロイとCI/CD設定
