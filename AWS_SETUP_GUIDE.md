# AWS Amplify セットアップガイド

**最終更新日**: 2025-11-08

---

## 📋 現在の状態

✅ AWS Amplify Gen2のプロジェクト設定が完了済み

### 既存の構成
- **バックエンド定義**: `amplify/backend.ts` - auth と data を定義
- **認証設定**: `amplify/auth/resource.ts` - メールログインが設定済み
- **データ設定**: `amplify/data/resource.ts` - Todoサンプルスキーマ（要カスタマイズ）

---

## 🎯 準備が必要な項目

### 1. AWS認証情報（IAM）

#### 必要なもの
- **AWSアカウント**: すでにお持ちと想定
- **IAM認証情報**: Amplify CLIがAWSにアクセスするための認証情報

#### 設定方法

##### オプション A: AWS CLI経由（推奨）
```bash
# AWS CLIのインストール（未インストールの場合）
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# AWS認証情報の設定
aws configure
```

入力項目：
- **AWS Access Key ID**: あなたのアクセスキーID
- **AWS Secret Access Key**: あなたのシークレットアクセスキー
- **Default region name**: `ap-northeast-1` （東京リージョン推奨）
- **Default output format**: `json`

##### オプション B: 環境変数
```bash
export AWS_ACCESS_KEY_ID="あなたのアクセスキーID"
export AWS_SECRET_ACCESS_KEY="あなたのシークレットアクセスキー"
export AWS_REGION="ap-northeast-1"
```

---

### 2. Amplify CLIのセットアップ

#### インストール確認
```bash
# Amplify CLIがインストール済みか確認
npx ampx --version
```

#### 初回セットアップ（未設定の場合）
```bash
# Amplify環境の初期化（既に設定済みの場合はスキップ）
npx ampx configure profile
```

---

### 3. 必要なAWS IAMポリシー

Amplify CLIを使用するIAMユーザーには、以下のサービスへのアクセス権限が必要です：

#### 必須サービス
- **AWS Amplify**: プロジェクト管理
- **Amazon Cognito**: ユーザー認証
- **Amazon DynamoDB**: データストア
- **AWS AppSync**: GraphQL API
- **AWS Lambda**: 集計処理
- **Amazon EventBridge**: 定期実行
- **AWS CloudFormation**: インフラ構築
- **IAM**: ロール・ポリシー管理

#### 推奨IAMポリシー
開発環境では、以下のAWS管理ポリシーを付与すると便利です：
- `AdministratorAccess-Amplify`

または、最小権限の原則に従う場合は、カスタムポリシーを作成してください。

---

### 4. リージョン設定

#### 推奨リージョン
- **ap-northeast-1** (東京) - 日本のユーザーに最適

#### 変更方法
`amplify/backend.ts` でリージョンを指定する場合：
```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

defineBackend({
  auth,
  data,
});
```

環境変数で設定：
```bash
export AWS_REGION=ap-northeast-1
```

---

### 5. Cognito設定の確認

#### 現在の設定（amplify/auth/resource.ts）
```typescript
export const auth = defineAuth({
  loginWith: {
    email: true,  // ✅ メールログインが有効
  },
});
```

#### 追加で設定すべき項目（Phase 1で実装）
- パスワードポリシー
- メール検証設定
- アカウント復旧設定
- サインアップ属性（email必須化）

---

### 6. DynamoDB & AppSync設定

#### 現在の設定（amplify/data/resource.ts）
- **サンプルモデル**: `Todo` モデルが定義済み
- **認証方式**: `publicApiKey()` - APIキーで誰でもアクセス可能（要変更）

#### 変更が必要な点（Phase 1で実装）
1. サンプルの`Todo`モデルを削除
2. 新しいスキーマを定義：
   - `User`
   - `Deck`
   - `MatchRecord`
   - `AggregatedStats`
3. 認証方式を変更：
   - ユーザーデータ: `allow.owner()` - 所有者のみアクセス可
   - 統計データ: `allow.guest()` - 未認証でも読み取り可

---

## 🚀 開発環境の起動手順

### サンドボックス環境の起動
```bash
# Amplify サンドボックスを起動（初回は時間がかかる）
npx ampx sandbox

# 別のターミナルでNext.jsを起動
npm run dev
```

### 初回起動時の注意
- サンドボックス起動には5〜10分程度かかります
- CloudFormationでリソースが作成されます
- 初回起動時にAWS認証情報を求められる場合があります

---

## 🧪 動作確認

### 1. サンドボックスが正常に起動したか確認
```bash
npx ampx sandbox
# 以下のようなメッセージが表示されればOK
# ✅ Sandbox is running!
# ✅ AppSync endpoint: https://xxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql
```

### 2. 認証機能の確認
```bash
# Cognitoユーザープールが作成されたか確認
aws cognito-idp list-user-pools --max-results 10
```

### 3. GraphQL APIの確認
- AppSync consoleにアクセス
- スキーマが正しく定義されているか確認
- Queryを実行してみる

---

## 📦 必要なnpmパッケージ

### 既にインストールされているもの
```json
{
  "@aws-amplify/backend": "^x.x.x",
  "@aws-amplify/backend-cli": "^x.x.x"
}
```

### 追加で必要なパッケージ（Phase 2以降で追加）
```bash
# Amplify フロントエンドライブラリ
npm install aws-amplify

# GraphQL型生成（既に利用可能）
npx ampx generate graphql-client-code
```

---

## 🔐 セキュリティのベストプラクティス

### 1. IAM認証情報の管理
- ❌ `.env`ファイルにAWS認証情報を保存しない
- ✅ AWS CLIの`~/.aws/credentials`を使用
- ✅ 本番環境ではIAMロールを使用

### 2. 環境変数の管理
```bash
# .env.local ファイルに記載（Git管理外）
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
```

`.gitignore`に追加済みか確認：
```
.env*.local
.amplify
```

### 3. APIキーの有効期限
現在の設定では、APIキーが30日で期限切れになります：
```typescript
apiKeyAuthorizationMode: {
  expiresInDays: 30,  // Phase 1で認証方式を変更するため削除予定
}
```

---

## 🛠️ トラブルシューティング

### エラー: "Failed to authenticate"
**原因**: AWS認証情報が未設定または期限切れ

**解決方法**:
```bash
# 認証情報を再設定
aws configure

# または環境変数を設定
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
```

---

### エラー: "Resource limit exceeded"
**原因**: AWSアカウントのリソース制限

**解決方法**:
- AWS Support Centerでクォータの引き上げをリクエスト
- 不要なリソースを削除

---

### サンドボックスが起動しない
**確認事項**:
1. インターネット接続は正常か
2. AWS認証情報は正しいか
3. リージョンは正しく設定されているか
4. CloudFormationでエラーが発生していないか

**ログ確認**:
```bash
# Amplify CLIのログを確認
npx ampx sandbox --verbose
```

---

## 📌 次のステップ

### Phase 1開始前の確認チェックリスト
- [ ] AWS認証情報が設定されている
- [ ] Amplify CLIがインストールされている
- [ ] `npx ampx sandbox`が正常に起動する
- [ ] Cognitoユーザープールが作成されている
- [ ] AppSync APIエンドポイントが確認できる

### 準備完了後
✅ [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)のPhase 1から作業開始

---

## 🔗 参考リンク

- [AWS Amplify Gen2 公式ドキュメント](https://docs.amplify.aws/gen2/)
- [Amplify Auth (Cognito)](https://docs.amplify.aws/gen2/build-a-backend/auth/)
- [Amplify Data (AppSync + DynamoDB)](https://docs.amplify.aws/gen2/build-a-backend/data/)
- [AWS CLI設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

---

## 💡 補足: AWSコストの見積もり

### 無料枠（AWS Free Tier）
- **Cognito**: 月50,000 MAU（月間アクティブユーザー）まで無料
- **DynamoDB**: 25GB、読み取り/書き込みキャパシティ無料枠あり
- **AppSync**: 月25万クエリまで無料
- **Lambda**: 月100万リクエスト、400,000 GB秒の実行時間まで無料

### 想定コスト（無料枠超過後）
- **小規模運用（100ユーザー、1日100試合）**: 月額 $5〜$10
- **中規模運用（1000ユーザー、1日1000試合）**: 月額 $20〜$50

詳細は[AWS料金計算ツール](https://calculator.aws/)で確認してください。
