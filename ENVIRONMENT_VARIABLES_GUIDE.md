# 🔧 環境変数設定ガイド

## 📋 必要な環境変数

### 1. ローカル開発環境 (.env.local)

| 環境変数名 | 説明 | 取得場所 | 必須 |
|-----------|------|---------|------|
| `NEXT_PUBLIC_APPSYNC_API_KEY` | AppSync GraphQL API Key | AWS AppSync Console または amplify_outputs.json (31行目) | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAILS` | 管理者権限を持つメールアドレス（カンマ区切り） | 自分で設定 | ⚠️ 管理画面使用時のみ |

### 2. Amplify Hosting環境変数

Amplify Hostingコンソールで以下の環境変数を設定する必要があります：

#### 必須の環境変数

```bash
# AppSync API Key（公開統計ページ用）
NEXT_PUBLIC_APPSYNC_API_KEY=da2-zrtrdmlpkja47kbckvtswef5ya
```

#### オプションの環境変数

```bash
# 管理者権限を持つメールアドレス（カンマ区切り）
# 例: admin@example.com,manager@example.com
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

## 🔍 環境変数の値の取得方法

### NEXT_PUBLIC_APPSYNC_API_KEY

#### 方法1: amplify_outputs.jsonから取得
```bash
# ローカルでサンドボックスを起動
npx ampx sandbox

# amplify_outputs.jsonが生成される
# 31行目の "api_key" の値を使用
```

#### 方法2: AWS AppSyncコンソールから取得
1. AWS Management Consoleにログイン
2. AppSyncサービスに移動
3. 該当するAPIを選択
4. 左側メニューの「Settings」をクリック
5. 「API Keys」セクションでキーを確認

### NEXT_PUBLIC_ADMIN_EMAILS

管理機能を使用するユーザーのメールアドレスを設定します。
- 複数のメールアドレスはカンマ区切りで指定
- Cognitoでサインアップしたメールアドレスと一致する必要があります

## 📝 設定手順

### ローカル開発環境

1. `.env.local.example`をコピー
```bash
cp .env.local.example .env.local
```

2. `.env.local`を編集
```bash
# .env.local
NEXT_PUBLIC_APPSYNC_API_KEY=da2-zrtrdmlpkja47kbckvtswef5ya
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

3. 開発サーバーを再起動
```bash
npm run dev
```

### Amplify Hosting

1. AWS Amplify Consoleにログイン
2. アプリを選択
3. 「App settings」→「Environment variables」に移動
4. 「Manage variables」をクリック
5. 以下を追加：

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APPSYNC_API_KEY` | `[新しいAPI Key]` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `[管理者メールアドレス]` |

6. 「Save」をクリック
7. アプリを再デプロイ

## ⚠️ 重要な注意事項

### API Keyのローテーション

現在のAPI Key (`da2-zrtrdmlpkja47kbckvtswef5ya`) はGitHubに露出しているため、以下の手順でローテーションしてください：

1. **AWS AppSyncコンソール**で新しいAPI Keyを作成
2. 古いAPI Keyを無効化
3. `.env.local`を新しいキーで更新
4. Amplify Hostingの環境変数を更新
5. アプリを再デプロイ

### セキュリティベストプラクティス

- ❌ `.env.local`をGitにコミットしない（.gitignoreで除外済み）
- ❌ API Keyをソースコードにハードコードしない
- ✅ 定期的にAPI Keyをローテーション（3ヶ月ごと推奨）
- ✅ 最小権限の原則に従う（読み取り専用のAPI Key）

## 🔄 環境変数の使用箇所

### API Key使用箇所
- `app/stats/page.tsx` - 公開統計ページ
- `components/stats/SeasonFilter.tsx` - シーズンフィルター

### 管理者メール使用箇所
- `utils/auth.ts` - 管理者権限チェック

## 🐛 トラブルシューティング

### API Keyが機能しない場合

1. 環境変数が正しく設定されているか確認
```bash
# ローカル環境
echo $NEXT_PUBLIC_APPSYNC_API_KEY
```

2. API Keyの有効期限を確認（デフォルト30日）

3. API Keyの権限を確認（読み取り権限が必要）

### 管理画面にアクセスできない場合

1. `NEXT_PUBLIC_ADMIN_EMAILS`にメールアドレスが含まれているか確認
2. Cognitoでサインアップしたメールアドレスと一致しているか確認
3. カンマ区切りで複数指定する場合、スペースを含めない

## 📚 参考リンク

- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [AWS Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [AWS AppSync API Keys](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html#api-key-authorization)